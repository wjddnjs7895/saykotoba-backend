import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import {
  VerifyPurchaseRequestDto,
  VerifyPurchaseResponseDto,
} from './dtos/verify-purchase.dto';
import { User } from '@/common/decorators/user.decorator';
import { UserEntity } from '../user/entities/user.entity';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('verify')
  async verifyPurchase(
    @User() user: UserEntity,
    @Body()
    verifyPurchaseRequestDto: VerifyPurchaseRequestDto,
  ): Promise<VerifyPurchaseResponseDto> {
    await this.paymentService.verifyPurchase({
      userId: user.id,
      receipt: verifyPurchaseRequestDto.receipt,
      platform: verifyPurchaseRequestDto.platform,
    });
    return { success: true };
  }

  @Post('webhooks/google')
  async googleWebhook(@Body() notification: any) {
    await this.paymentService.handleGoogleWebhook(notification);
    return { success: true };
  }

  @Post('webhooks/apple')
  async appleWebhook(@Body() notification: any) {
    await this.paymentService.handleAppleWebhook(notification);
    return { success: true };
  }
}
