import { Type } from 'class-transformer';
import {
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export enum GoogleNotificationType {
  SUBSCRIPTION_RECOVERED = 1,
  SUBSCRIPTION_RENEWED = 2,
  SUBSCRIPTION_CANCELED = 3,
  SUBSCRIPTION_PURCHASED = 4,
  SUBSCRIPTION_ON_HOLD = 5,
  SUBSCRIPTION_IN_GRACE_PERIOD = 6,
  SUBSCRIPTION_RESTARTED = 7,
  SUBSCRIPTION_PRICE_CHANGE_CONFIRMED = 8,
  SUBSCRIPTION_DEFERRED = 9,
  SUBSCRIPTION_PAUSED = 10,
  SUBSCRIPTION_PAUSE_SCHEDULE_CHANGED = 11,
  SUBSCRIPTION_REVOKED = 12,
  SUBSCRIPTION_EXPIRED = 13,
}

class Message {
  @IsString()
  data: string;
  @IsString()
  messageId: string;
  @IsString()
  message_id: string;
  @IsString()
  publishTime: string;
  @IsString()
  publish_time: string;
}

export class GoogleWebhookNotificationDto {
  @IsObject()
  @ValidateNested()
  @Type(() => Message)
  message: Message;
  @IsString()
  subscription: string;
}

class SubscriptionNotification {
  @IsString()
  version: string;
  @IsNumber()
  notificationType: number;
  @IsString()
  purchaseToken: string;
  @IsString()
  subscriptionId: string;
}

class VoidedPurchaseNotification {
  @IsString()
  purchaseToken: string;
  @IsString()
  orderId: string;
  @IsNumber()
  productType: number;
  @IsNumber()
  refundType: number;
}

export class GoogleWebhookDecodedDataDto {
  @IsString()
  version: string;
  @IsString()
  packageName: string;
  @IsString()
  eventTimeMillis: string;
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => VoidedPurchaseNotification)
  voidedPurchaseNotification?: VoidedPurchaseNotification;
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SubscriptionNotification)
  subscriptionNotification?: SubscriptionNotification;
}
