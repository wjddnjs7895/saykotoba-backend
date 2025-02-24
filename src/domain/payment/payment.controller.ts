import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import {
  VerifyPurchaseRequestDto,
  VerifyPurchaseResponseDto,
} from './dtos/verify-purchase.dto';
import { User } from '@/common/decorators/user.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { Public } from '@/common/decorators/public.decorator';
import { CustomLogger } from '@/common/logger/custom.logger';
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly logger: CustomLogger,
  ) {}

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

  @Public()
  @Post('webhook/google')
  async googleWebhook(@Body() notification: any) {
    await this.paymentService.handleGoogleWebhook(notification);
    return { success: true };
  }

  @Public()
  @Post('webhook/apple')
  async appleWebhook(@Body() notification: any) {
    try {
      await this.paymentService.handleAppleWebhook(notification);
      return { success: true };
    } catch (error) {
      this.logger.error('Webhook error:', error);
      throw error;
    }
  }
}
