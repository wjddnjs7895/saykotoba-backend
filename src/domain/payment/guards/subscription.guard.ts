import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { PaymentService } from '../payment.service';
import { SubscriptionUnauthorizedException } from '@/common/exception/custom-exception/subscription.exception';
import { UserService } from '@/domain/user/services/user.service';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private paymentService: PaymentService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;

    const isSubscribed = await this.paymentService.isActiveSubscriber(userId);
    const hasFreeTrial = await this.userService.hasFreeTrial({ userId });
    if (!isSubscribed && !hasFreeTrial) {
      throw new SubscriptionUnauthorizedException();
    }

    return true;
  }
}
