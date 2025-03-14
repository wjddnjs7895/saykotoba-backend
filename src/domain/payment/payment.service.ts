import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { SubscriptionEntity } from './entities/subscription.entity';
import * as iap from 'in-app-purchase';
import { SubscriptionStatus } from '@/common/constants/user.constants';
import { LessThan } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { VerifyPurchaseServiceDto } from './dtos/verify-purchase.dto';
import { ConfigService } from '@nestjs/config';
import {
  AppleReceiptDecodeFailedException,
  AppleReceiptNotFoundException,
  InvalidReceiptException,
  PendingWebhookFailedException,
  SubscriptionExpiredException,
  SubscriptionNotFoundException,
  SubscriptionUpdateFailedException,
} from '@/common/exception/custom-exception/subscription.exception';
import { UnexpectedException } from '@/common/exception/custom-exception/unexpected.exception';
import { CustomBaseException } from '@/common/exception/custom.base.exception';
import { StoreType } from '@/common/constants/user.constants';
import { AppleWebhookUtil } from './utils/apple-webhook.util';
import { AppleNotificationType } from './dtos/apple-webhook.dto';
import { GoogleWebhookNotificationDto } from './dtos/google-webhook.dto';
import {
  RestoreSubscriptionResponseDto,
  RestoreSubscriptionServiceDto,
} from './dtos/restore-subscription';
import { Platform } from '@/common/types/system';
import { LogParams } from '@/common/decorators/log-params.decorator';
import { PendingWebhookEntity } from './entities/pending-webhook.entity';
import { GoogleWebhookUtil } from './utils/google-webhook.util';

@Injectable()
export class PaymentService implements OnModuleInit {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    private readonly configService: ConfigService,
    @InjectRepository(PendingWebhookEntity)
    private readonly pendingWebhookRepository: Repository<PendingWebhookEntity>,
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

  @LogParams()
  async verifyPurchase({
    receipt,
    platform,
    userId,
  }: VerifyPurchaseServiceDto): Promise<boolean> {
    try {
      await iap.setup();

      let validationResponse;
      let originalTransactionId = receipt;

      if (platform === 'GOOGLE') {
        validationResponse = await iap.validate(iap.GOOGLE, receipt);
        const purchaseData = validationResponse.purchaseData?.[0];

        if (!purchaseData) {
          throw new InvalidReceiptException();
        }

        if (purchaseData.purchaseState !== 0) {
          throw new InvalidReceiptException();
        }

        if (
          purchaseData.expiryDate &&
          new Date(purchaseData.expiryDate) < new Date()
        ) {
          throw new SubscriptionExpiredException();
        }

        originalTransactionId = purchaseData.purchaseToken || receipt;
      } else {
        validationResponse = await iap.validate(iap.APPLE, receipt);
        try {
          const rawNotification = { signedPayload: receipt };
          const transactionInfo =
            AppleWebhookUtil.extractTransactionInfo(rawNotification);

          if (transactionInfo.originalTransactionId) {
            originalTransactionId = transactionInfo.originalTransactionId;
          } else if (
            validationResponse.receipt &&
            validationResponse.receipt.in_app
          ) {
            const latestReceipt = validationResponse.receipt.in_app[0];
            if (latestReceipt && latestReceipt.original_transaction_id) {
              originalTransactionId = latestReceipt.original_transaction_id;
            }
          }
        } catch {
          throw new AppleReceiptDecodeFailedException();
        }
      }

      const isValid = await iap.isValidated(validationResponse);
      if (!isValid) {
        throw new InvalidReceiptException();
      }

      const subscription = await this.subscriptionRepository.findOne({
        where: { user: { id: userId } },
      });

      if (!subscription) {
        throw new SubscriptionNotFoundException();
      }

      try {
        const updateData: Partial<SubscriptionEntity> = {
          originalTransactionId,
          status: SubscriptionStatus.ACTIVE,
        };

        // Google Play의 경우 만료일 업데이트
        if (
          platform === 'GOOGLE' &&
          validationResponse.purchaseData?.[0]?.expiryDate
        ) {
          updateData.expiresAt = new Date(
            validationResponse.purchaseData[0].expiryDate,
          );
        }

        await this.subscriptionRepository.update(
          { id: subscription.id },
          updateData,
        );
      } catch {
        throw new SubscriptionUpdateFailedException();
      }

      return isValid;
    } catch (error) {
      if (error instanceof CustomBaseException) {
        throw error;
      }
      throw new UnexpectedException(error.message);
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

  @LogParams()
  async handleGoogleWebhook(notification: GoogleWebhookNotificationDto) {
    try {
      const transactionInfo =
        GoogleWebhookUtil.extractTransactionInfo(notification);
      const originalTransactionId = transactionInfo.originalTransactionId;

      const subscription = await this.subscriptionRepository.findOne({
        where: { originalTransactionId },
        relations: ['user'],
      });

      if (!subscription) {
        await this.pendingWebhookRepository.save({
          originalTransactionId,
          notification: JSON.stringify(notification),
        });
        return true;
      }

      let status = SubscriptionStatus.ACTIVE;
      const updateData: Partial<SubscriptionEntity> = {
        originalTransactionId,
        latestTransactionId: transactionInfo.transactionId,
        isAutoRenew: transactionInfo.isAutoRenewable,
        storeType: StoreType.GOOGLE_PLAY,
      };

      if (transactionInfo.expiresDate) {
        updateData.expiresAt = new Date(transactionInfo.expiresDate);
      }

      if (transactionInfo.cancelReason) {
        status = SubscriptionStatus.EXPIRED;
        updateData.cancelledAt = new Date();
      } else {
        updateData.lastPaidAt = new Date();
      }

      updateData.status = status;

      try {
        await this.subscriptionRepository.update(
          { id: subscription.id },
          { ...updateData },
        );
      } catch {
        throw new SubscriptionUpdateFailedException();
      }
      return true;
    } catch (error) {
      if (error instanceof CustomBaseException) {
        throw error;
      }
      throw new UnexpectedException(error.message);
    }
  }

  @LogParams()
  async handleAppleWebhook(notification: any, isPending: boolean = false) {
    try {
      const transactionInfo =
        AppleWebhookUtil.extractTransactionInfo(notification);
      const originalTransactionId =
        transactionInfo.originalTransactionId ||
        notification.originalTransactionId;

      const subscription = await this.subscriptionRepository.findOne({
        where: { originalTransactionId },
        relations: ['user'],
      });

      if (!subscription && !isPending) {
        await this.pendingWebhookRepository.save({
          originalTransactionId,
          notification: JSON.stringify(notification),
        });
        return true;
      }

      let status = SubscriptionStatus.ACTIVE;
      const updateData: Partial<SubscriptionEntity> = {
        originalTransactionId,
        latestTransactionId:
          transactionInfo.transactionId || notification.transactionId,
        isAutoRenew:
          transactionInfo.isAutoRenewable !== undefined
            ? transactionInfo.isAutoRenewable
            : notification.autoRenewStatus === '1',
        storeType: StoreType.APP_STORE,
      };

      if (transactionInfo.expiresDate) {
        updateData.expiresAt = new Date(transactionInfo.expiresDate);
      } else if (notification.expiresDate) {
        updateData.expiresAt = new Date(parseInt(notification.expiresDate));
      }

      const notificationType =
        transactionInfo.notificationType || notification.notificationType;

      switch (notificationType) {
        case AppleNotificationType.SUBSCRIBED:
        case AppleNotificationType.DID_RENEW:
        case AppleNotificationType.OFFER_REDEEMED:
          status = SubscriptionStatus.ACTIVE;
          updateData.lastPaidAt = new Date();
          break;

        case AppleNotificationType.EXPIRED:
        case AppleNotificationType.DID_FAIL_TO_RENEW:
        case AppleNotificationType.REVOKE:
        case AppleNotificationType.GRACE_PERIOD_EXPIRED:
        case AppleNotificationType.REFUND:
          status = SubscriptionStatus.EXPIRED;
          updateData.cancelledAt = new Date();
          break;

        case AppleNotificationType.DID_CHANGE_RENEWAL_STATUS:
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
          { id: subscription.id },
          { ...updateData },
        );
      } catch {
        throw new SubscriptionUpdateFailedException();
      }
      return true;
    } catch (error) {
      if (error instanceof CustomBaseException) {
        throw error;
      }
      throw new UnexpectedException(error.message);
    }
  }

  @Cron('*/10 * * * *')
  async processPendingWebhooks() {
    const pendingWebhooks = await this.pendingWebhookRepository.find({
      where: {
        isProcessed: false,
        createdAt: MoreThan(new Date(Date.now() - 24 * 60 * 60 * 1000)),
      },
      take: 50,
    });

    for (const webhook of pendingWebhooks) {
      try {
        const subscription = await this.subscriptionRepository.findOne({
          where: { originalTransactionId: webhook.originalTransactionId },
        });

        if (subscription) {
          const result = await this.handleAppleWebhook(
            JSON.parse(webhook.notification),
            true,
          );

          if (result) {
            await this.pendingWebhookRepository.update(
              { id: webhook.id },
              { processedAt: new Date(), isProcessed: true },
            );
          }
        }
      } catch {
        throw new PendingWebhookFailedException();
      }
    }
  }

  @LogParams()
  async isActiveSubscriber(userId: number): Promise<boolean> {
    const subscription = await this.subscriptionRepository.findOne({
      where: {
        user: { id: userId },
        status: SubscriptionStatus.ACTIVE,
      },
    });

    return !!subscription;
  }

  @LogParams()
  async restoreSubscription({
    receipt,
    platform,
    userId,
  }: RestoreSubscriptionServiceDto): Promise<RestoreSubscriptionResponseDto> {
    try {
      await iap.setup();

      const validationResponse = await iap.validate(
        platform === Platform.GOOGLE ? iap.GOOGLE : iap.APPLE,
        receipt,
      );

      const isValid = await iap.isValidated(validationResponse);
      if (!isValid) {
        throw new InvalidReceiptException();
      }

      let originalTransactionId;
      let expiresAt: Date | null = null;

      if (platform === Platform.APPLE) {
        try {
          const validationResponse = await iap.validate(iap.APPLE, receipt);
          const latestReceipt =
            validationResponse.latest_receipt_info?.[0] ||
            validationResponse.receipt?.in_app?.[0];

          if (latestReceipt) {
            originalTransactionId = latestReceipt.original_transaction_id;
            expiresAt = latestReceipt.expires_date_ms
              ? new Date(parseInt(latestReceipt.expires_date_ms))
              : null;
          } else {
            throw new AppleReceiptNotFoundException();
          }
        } catch {
          throw new AppleReceiptDecodeFailedException();
        }
      } else if (platform === Platform.GOOGLE) {
        const purchaseData = validationResponse.purchaseData[0];
        if (purchaseData.expiryDate) {
          expiresAt = new Date(purchaseData.expiryDate);
        }
      }

      if (expiresAt && expiresAt > new Date()) {
        try {
          const subscription = await this.subscriptionRepository.findOne({
            where: { user: { id: userId } },
          });

          if (subscription) {
            const updatedSubscription =
              await this.subscriptionRepository.update(
                { user: { id: userId } },
                {
                  originalTransactionId,
                  status: SubscriptionStatus.ACTIVE,
                  expiresAt: expiresAt,
                },
              );

            if (updatedSubscription) {
              const allSubscriptionsWithSameTransaction =
                await this.subscriptionRepository.find({
                  where: { originalTransactionId },
                  relations: ['user'],
                });

              for (const sub of allSubscriptionsWithSameTransaction) {
                if (sub.user && sub.user.id !== userId) {
                  {
                    await this.subscriptionRepository.update(
                      { id: sub.id },
                      {
                        status: SubscriptionStatus.EXPIRED,
                        cancelledAt: new Date(),
                      },
                    );
                  }
                }
              }
            }
          }
        } catch {
          throw new SubscriptionUpdateFailedException();
        }
      } else {
        throw new SubscriptionExpiredException();
      }

      return { success: true };
    } catch (error) {
      if (error instanceof CustomBaseException) {
        throw error;
      }
      throw new UnexpectedException('Restore subscription: ' + error.message);
    }
  }
}
