import { Global, Module } from '@nestjs/common';
import { S3LoggerService } from '@/integrations/aws/services/s3/s3-logger.service';
import { CustomLoggerService } from './logger.service';
import { ConfigModule } from '@nestjs/config';
import { AwsModule } from '@/integrations/aws/aws.module';

@Global()
@Module({
  providers: [CustomLoggerService, S3LoggerService],
  exports: [CustomLoggerService, S3LoggerService],
  imports: [ConfigModule, AwsModule],
})
export class LoggerModule {}
