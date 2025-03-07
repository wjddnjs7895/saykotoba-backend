export interface AppleRawNotification {
  signedPayload: string;
}

export enum AppleNotificationType {
  SUBSCRIBED = 'SUBSCRIBED',
  DID_RENEW = 'DID_RENEW',
  OFFER_REDEEMED = 'OFFER_REDEEMED',
  EXPIRED = 'EXPIRED',
  DID_FAIL_TO_RENEW = 'DID_FAIL_TO_RENEW',
  REVOKE = 'REVOKE',
  GRACE_PERIOD_EXPIRED = 'GRACE_PERIOD_EXPIRED',
  REFUND = 'REFUND',
  DID_CHANGE_RENEWAL_STATUS = 'DID_CHANGE_RENEWAL_STATUS',
}

export interface AppleWebhookV2NotificationDto {
  notificationType: AppleNotificationType | string;
  notificationUUID: string;
  data: {
    appAppleId: number;
    bundleId: string;
    bundleVersion: string;
    environment: 'Sandbox' | 'Production';
    signedTransactionInfo: string;
    signedRenewalInfo?: string;
    status: number;
  };
  version: string;
  signedDate: number;
}

export interface AppleWebhookV1NotificationDto {
  notificationType: AppleNotificationType | string;
  originalTransactionId: string;
  transactionId: string;
  expiresDate: string;
  autoRenewStatus: string;
}

export type AppleWebhookNotificationDto =
  | AppleWebhookV2NotificationDto
  | AppleWebhookV1NotificationDto;

export interface AppleTransactionInfoDto {
  expiresDate?: number;
  originalTransactionId?: string;
  transactionId?: string;
  isAutoRenewable?: boolean;
  notificationType?: AppleNotificationType | string;
  appAccountToken?: string;
}
