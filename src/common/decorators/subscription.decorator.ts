import { SubscriptionGuard } from '@/domain/payment/guards/subscription.guard';
import { applyDecorators, UseGuards } from '@nestjs/common';

export function RequireSubscription() {
  return applyDecorators(UseGuards(SubscriptionGuard));
}
