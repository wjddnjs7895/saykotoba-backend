import * as jwt from 'jsonwebtoken';
import { Logger } from '@nestjs/common';
import {
  AppleTransactionInfoDto,
  AppleWebhookV2NotificationDto,
} from '../dtos/apple-webhook.dto';

export class AppleWebhookUtil {
  static decodeJWT(token: string): any {
    try {
      const decoded = jwt.decode(token);
      Logger.log('Decoded JWT payload:', JSON.stringify(decoded, null, 2));
      return decoded;
    } catch (error) {
      Logger.error('Failed to decode Apple JWT token', error);
      return null;
    }
  }

  static isV2Notification(
    notification: any,
  ): notification is AppleWebhookV2NotificationDto {
    return (
      notification &&
      notification.data &&
      notification.data.signedTransactionInfo
    );
  }
  static extractTransactionInfo(notification: any): AppleTransactionInfoDto {
    const result: AppleTransactionInfoDto = {};

    result.notificationType = notification.notificationType;

    if (this.isV2Notification(notification)) {
      if (notification.data.signedTransactionInfo) {
        const decoded = this.decodeJWT(notification.data.signedTransactionInfo);

        if (decoded) {
          if (decoded.expiresDate) {
            result.expiresDate = decoded.expiresDate;
          } else if (decoded.data?.expiresDate) {
            result.expiresDate = decoded.data.expiresDate;
          }

          if (decoded.originalTransactionId) {
            result.originalTransactionId = decoded.originalTransactionId;
          } else if (decoded.data?.originalTransactionId) {
            result.originalTransactionId = decoded.data.originalTransactionId;
          }

          if (decoded.transactionId) {
            result.transactionId = decoded.transactionId;
          } else if (decoded.data?.transactionId) {
            result.transactionId = decoded.data.transactionId;
          }

          if (decoded.autoRenewStatus !== undefined) {
            result.isAutoRenewable =
              decoded.autoRenewStatus === '1' || decoded.autoRenewStatus === 1;
          } else if (decoded.data?.autoRenewStatus !== undefined) {
            result.isAutoRenewable =
              decoded.data.autoRenewStatus === '1' ||
              decoded.data.autoRenewStatus === 1;
          }
        }
      }

      if (notification.data.signedRenewalInfo) {
        const decoded = this.decodeJWT(notification.data.signedRenewalInfo);

        if (
          decoded &&
          result.isAutoRenewable === undefined &&
          decoded.autoRenewStatus !== undefined
        ) {
          result.isAutoRenewable =
            decoded.autoRenewStatus === '1' || decoded.autoRenewStatus === 1;
        }
      }
    } else {
      if (notification.expiresDate) {
        result.expiresDate = parseInt(notification.expiresDate);
      }

      if (notification.originalTransactionId) {
        result.originalTransactionId = notification.originalTransactionId;
      }

      if (notification.transactionId) {
        result.transactionId = notification.transactionId;
      }

      if (notification.autoRenewStatus) {
        result.isAutoRenewable = notification.autoRenewStatus === '1';
      }
    }

    return result;
  }
}
