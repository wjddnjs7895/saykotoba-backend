import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { PaymentService } from '../payment.service';
import { SubscriptionUnauthorizedException } from '@/common/exception/custom-exception/subscription.exception';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private paymentService: PaymentService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;

    const isSubscribed = await this.paymentService.isActiveSubscriber(userId);
    if (!isSubscribed) {
      throw new SubscriptionUnauthorizedException();
    }

    return true;
  }
}
