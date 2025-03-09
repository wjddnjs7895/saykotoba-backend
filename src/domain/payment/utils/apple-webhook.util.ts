import * as jwt from 'jsonwebtoken';
import {
  AppleRawNotification,
  AppleTransactionInfoDto,
  AppleWebhookV2NotificationDto,
} from '../dtos/apple-webhook.dto';

export class AppleWebhookUtil {
  static decodeJWT(token: string): any {
    try {
      const decoded = jwt.decode(token);
      return decoded;
    } catch {
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

  static extractTransactionInfo(
    rawNotification: AppleRawNotification | any,
  ): AppleTransactionInfoDto {
    const result: AppleTransactionInfoDto = {};

    if ('signedPayload' in rawNotification) {
      const decodedPayload = this.decodeJWT(rawNotification.signedPayload);

      if (decodedPayload) {
        if (decodedPayload.notificationType) {
          result.notificationType = decodedPayload.notificationType;
        }

        if (decodedPayload.data) {
          if (decodedPayload.data.signedTransactionInfo) {
            const txInfo = this.decodeJWT(
              decodedPayload.data.signedTransactionInfo,
            );

            if (txInfo) {
              if (txInfo.expiresDate) {
                result.expiresDate = txInfo.expiresDate;
              }

              if (txInfo.originalTransactionId) {
                result.originalTransactionId = txInfo.originalTransactionId;
              }

              if (txInfo.transactionId) {
                result.transactionId = txInfo.transactionId;
              }

              if (txInfo.autoRenewStatus !== undefined) {
                result.isAutoRenewable =
                  txInfo.autoRenewStatus === '1' ||
                  txInfo.autoRenewStatus === 1;
              }

              if (txInfo.appAccountToken) {
                result.appAccountToken = txInfo.appAccountToken;
              }
            }
          }

          if (decodedPayload.data.signedRenewalInfo) {
            const renewalInfo = this.decodeJWT(
              decodedPayload.data.signedRenewalInfo,
            );

            if (
              renewalInfo &&
              result.isAutoRenewable === undefined &&
              renewalInfo.autoRenewStatus !== undefined
            ) {
              result.isAutoRenewable =
                renewalInfo.autoRenewStatus === '1' ||
                renewalInfo.autoRenewStatus === 1;
            }
          }
        }

        return result;
      }
    }

    result.notificationType = rawNotification.notificationType;

    if (this.isV2Notification(rawNotification)) {
      if (rawNotification.data.signedTransactionInfo) {
        const decoded = this.decodeJWT(
          rawNotification.data.signedTransactionInfo,
        );

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

      if (rawNotification.data.signedRenewalInfo) {
        const decoded = this.decodeJWT(rawNotification.data.signedRenewalInfo);

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
      if (rawNotification.expiresDate) {
        result.expiresDate = parseInt(rawNotification.expiresDate);
      }

      if (rawNotification.originalTransactionId) {
        result.originalTransactionId = rawNotification.originalTransactionId;
      }

      if (rawNotification.transactionId) {
        result.transactionId = rawNotification.transactionId;
      }

      if (rawNotification.autoRenewStatus) {
        result.isAutoRenewable = rawNotification.autoRenewStatus === '1';
      }
    }

    return result;
  }
}
