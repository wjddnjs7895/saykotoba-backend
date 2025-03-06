import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import {
  VerifyPurchaseRequestDto,
  VerifyPurchaseResponseDto,
} from './dtos/verify-purchase.dto';
import { User } from '@/common/decorators/user.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { Public } from '@/common/decorators/public.decorator';
import { AppleRawNotification } from './dtos/apple-webhook.dto';
import {
  RestoreSubscriptionRequestDto,
  RestoreSubscriptionResponseDto,
} from './dtos/restore-subscription';
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('verify')
  async verifyPurchase(
    @User() user: UserEntity,
    @Body()
    verifyPurchaseRequestDto: VerifyPurchaseRequestDto,
  ): Promise<VerifyPurchaseResponseDto> {
    return {
      success: await this.paymentService.verifyPurchase({
        receipt: verifyPurchaseRequestDto.receipt,
        platform: verifyPurchaseRequestDto.platform,
        userId: user.id,
      }),
    };
  }

  @Post('restore')
  async restorePurchase(
    @User() user: UserEntity,
    @Body()
    restorePurchaseRequestDto: RestoreSubscriptionRequestDto,
  ): Promise<RestoreSubscriptionResponseDto> {
    return await this.paymentService.restoreSubscription({
      receipt: restorePurchaseRequestDto.receipt,
      platform: restorePurchaseRequestDto.platform,
      userId: user.id,
    });
  }

  @Public()
  @Post('webhook/google')
  async googleWebhook(@Body() notification: any) {
    await this.paymentService.handleGoogleWebhook(notification);
    return { success: true };
  }

  @Public()
  @Post('webhook/apple')
  async appleWebhook(@Body() notification: AppleRawNotification) {
    return await this.paymentService.handleAppleWebhook(notification);
  }
}
