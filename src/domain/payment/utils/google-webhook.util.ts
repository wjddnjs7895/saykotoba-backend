import { GoogleWebhookNotificationDto } from '../dtos/google-webhook.dto';
import { BadRequestException } from '@nestjs/common';

export class GoogleWebhookUtil {
  static validateNotification(notification: GoogleWebhookNotificationDto) {
    if (!notification.purchaseToken) {
      throw new BadRequestException('Purchase token is required');
    }
    if (!notification.subscriptionId) {
      throw new BadRequestException('Subscription ID is required');
    }
    if (!notification.notificationType) {
      throw new BadRequestException('Notification type is required');
    }
  }

  static extractTransactionInfo(notification: GoogleWebhookNotificationDto) {
    this.validateNotification(notification);

    return {
      originalTransactionId: notification.purchaseToken,
      transactionId: notification.subscriptionId,
      expiresDate: notification.expiryTimeMillis
        ? parseInt(notification.expiryTimeMillis)
        : undefined,
      isAutoRenewable: notification.autoRenewing,
      notificationType: notification.notificationType,
      cancelReason: notification.cancelReason,
    };
  }
}
