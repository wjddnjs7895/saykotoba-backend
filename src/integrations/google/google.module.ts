import { Module } from '@nestjs/common';
import { GoogleTTSService } from './services/google-tts.service';
import { GooglePaymentService } from './services/google-payment.service';
@Module({
  providers: [GoogleTTSService, GooglePaymentService],
  exports: [GoogleTTSService, GooglePaymentService],
})
export class GoogleModule {}
