import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionEntity } from './entities/subscription.entity';
import * as iap from 'in-app-purchase';
import { SubscriptionStatus } from '@/common/constants/user.constants';
import { LessThan, MoreThan } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { VerifyPurchaseRequestDto } from './dtos/verify-purchase.dto';
import { ConfigService } from '@nestjs/config';
import {
  InvalidReceiptException,
  SubscriptionUpdateFailedException,
} from '@/common/exception/custom-exception/subscription.exception';
import { UnexpectedException } from '@/common/exception/custom-exception/unexpected.exception';
import { CustomBaseException } from '@/common/exception/custom.base.exception';
import { StoreType } from '@/common/constants/user.constants';
import { CustomLogger } from '@/common/logger/custom.logger';

@Injectable()
export class PaymentService implements OnModuleInit {
  private readonly logger = new CustomLogger();

  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await iap.config({
      test: this.configService.get('NODE_ENV') !== 'production',
      googleServiceAccount: {
        clientEmail: this.configService.get('GOOGLE_IAP_CLIENT_EMAIL'),
        privateKey: this.configService.get('GOOGLE_IAP_API_KEY'),
      },
      applePassword: this.configService.get('APPLE_SHARED_SECRET'),
    });
  }

  async verifyPurchase({
    receipt,
    platform,
  }: VerifyPurchaseRequestDto): Promise<boolean> {
    try {
      await iap.setup();

      const validationResponse = await iap.validate(
        platform === 'GOOGLE' ? iap.GOOGLE : iap.APPLE,
        receipt,
      );
      console.log('validationResponse', validationResponse);

      const isValid = await iap.isValidated(validationResponse);

      if (!isValid) {
        throw new InvalidReceiptException();
      }

      return isValid;
    } catch (error) {
      if (error instanceof CustomBaseException) {
        throw error;
      }
      throw new UnexpectedException();
    }
  }

  @Cron('0 0 * * *')
  async checkExpiredSubscriptions() {
    const now = new Date();

    await this.subscriptionRepository.update(
      {
        expiresAt: LessThan(now),
        status: SubscriptionStatus.ACTIVE,
      },
      { status: SubscriptionStatus.EXPIRED },
    );
  }

  async handleGoogleWebhook(notification: {
    subscriptionId: string;
    purchaseToken: string;
    eventTimeMillis: number;
    notificationType: number;
  }) {
    const receipt = notification.purchaseToken;
    const validationResponse = await iap.validate(iap.GOOGLE, receipt);
    const purchaseData = validationResponse.purchaseData[0];

    await this.subscriptionRepository.update(
      { originalTransactionId: receipt },
      {
        status: purchaseData.cancelReason
          ? SubscriptionStatus.EXPIRED
          : SubscriptionStatus.ACTIVE,
        expiresAt: new Date(purchaseData.expiryDate),
      },
    );
  }

  async handleAppleWebhook(notification: {
    notificationType: string;
    originalTransactionId: string;
    transactionId: string;
    expiresDate: string;
    autoRenewStatus: string;
  }) {
    this.logger.log(
      `Received webhook notification: ${JSON.stringify(notification)}`,
    );

    try {
      const receipt = notification.originalTransactionId;
      const validationResponse = await iap.validate(iap.APPLE, receipt);
      const purchaseData = validationResponse.purchaseData[0];

      let status = SubscriptionStatus.ACTIVE;
      const updateData: Partial<SubscriptionEntity> = {
        latestTransactionId: notification.transactionId,
        expiresAt: new Date(purchaseData.expiryDate),
        isAutoRenew: notification.autoRenewStatus === '1',
        storeType: StoreType.APP_STORE,
      };

      switch (notification.notificationType) {
        case 'SUBSCRIBED':
        case 'DID_RENEW':
        case 'OFFER_REDEEMED':
          status = SubscriptionStatus.ACTIVE;
          updateData.lastPaidAt = new Date();
          break;

        case 'EXPIRED':
        case 'DID_FAIL_TO_RENEW':
        case 'REVOKE':
        case 'GRACE_PERIOD_EXPIRED':
        case 'REFUND':
          status = SubscriptionStatus.EXPIRED;
          updateData.cancelledAt = new Date();
          break;

        case 'DID_CHANGE_RENEWAL_STATUS':
          if (notification.autoRenewStatus === '0') {
            status = SubscriptionStatus.EXPIRED;
            updateData.cancelledAt = new Date();
          }
          break;

        default:
          return;
      }

      updateData.status = status;

      try {
        await this.subscriptionRepository.update(
          { originalTransactionId: receipt },
          updateData,
        );
      } catch {
        throw SubscriptionUpdateFailedException;
      }
    } catch (error) {
      if (error instanceof CustomBaseException) {
        throw error;
      }
      throw new UnexpectedException();
    }
  }

  async isActiveSubscriber(userId: number): Promise<boolean> {
    const subscription = await this.subscriptionRepository.findOne({
      where: {
        user: { id: userId },
        status: SubscriptionStatus.ACTIVE,
        expiresAt: MoreThan(new Date()),
      },
    });

    return !!subscription;
  }
}
