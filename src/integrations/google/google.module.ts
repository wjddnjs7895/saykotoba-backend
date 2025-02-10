import { Module } from '@nestjs/common';
import { GoogleTTSService } from './services/google-tts.service';
@Module({
  providers: [GoogleTTSService],
  exports: [GoogleTTSService],
})
export class GoogleModule {}
