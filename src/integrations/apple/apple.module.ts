import { Module } from '@nestjs/common';
import { ApplePaymentService } from './services/apple-payment.service';

@Module({
  providers: [ApplePaymentService],
  exports: [ApplePaymentService],
})
export class AppleModule {}
