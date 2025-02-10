import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionEntity } from './entities/subscription.entity';
import * as iap from 'in-app-purchase';
import {
  StoreType,
  SubscriptionStatus,
} from '@/common/constants/user.constants';
import { LessThan, MoreThan } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { VerifyPurchaseServiceDto } from './dtos/verify-purchase.dto';

@Injectable()
export class PaymentService implements OnModuleInit {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
  ) {}

  async onModuleInit() {
    await iap.config({
      test: process.env.NODE_ENV !== 'production',
      googleServiceAccount: {
        clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
        privateKey: process.env.GOOGLE_PRIVATE_KEY,
      },
      applePassword: process.env.APPLE_SHARED_SECRET,
    });
  }

  async verifyPurchase({
    userId,
    receipt,
    platform,
  }: VerifyPurchaseServiceDto): Promise<SubscriptionEntity> {
    try {
      await iap.setup();

      const validationResponse = await iap.validate(
        platform === 'GOOGLE' ? iap.GOOGLE : iap.APPLE,
        receipt,
      );

      const isValid = await iap.isValidated(validationResponse);

      if (!isValid) {
        throw new Error('Invalid receipt');
      }

      const purchaseData = validationResponse.purchaseData[0];

      const subscription = this.subscriptionRepository.create({
        user: { id: userId },
        storeType:
          platform === 'GOOGLE' ? StoreType.GOOGLE_PLAY : StoreType.APP_STORE,
        originalTransactionId: receipt,
        status: SubscriptionStatus.ACTIVE,
        expiresAt: new Date(purchaseData.expiryDate),
      });

      return await this.subscriptionRepository.save(subscription);
    } catch (error) {
      throw new Error(`Purchase verification failed: ${error.message}`);
    }
  }

  async handleSubscriptionWebhook(notification: any) {
    const { originalTransactionId, status } = notification;

    await this.subscriptionRepository.update(
      { originalTransactionId },
      {
        status:
          status === 'EXPIRED'
            ? SubscriptionStatus.EXPIRED
            : SubscriptionStatus.ACTIVE,
        expiresAt: new Date(notification.expirationDate),
      },
    );
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
    notification_type: string;
    original_transaction_id: string;
    expires_date: string;
  }) {
    const receipt = notification.original_transaction_id;
    const validationResponse = await iap.validate(iap.APPLE, receipt);
    const purchaseData = validationResponse.purchaseData[0];

    await this.subscriptionRepository.update(
      { originalTransactionId: receipt },
      {
        status: notification.notification_type.includes('EXPIRED')
          ? SubscriptionStatus.EXPIRED
          : SubscriptionStatus.ACTIVE,
        expiresAt: new Date(purchaseData.expiryDate),
      },
    );
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
