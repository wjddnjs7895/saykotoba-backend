import { Module } from '@nestjs/common';
import { S3Service } from './services/s3/s3.service';
import { ConfigModule } from '@nestjs/config';
import { S3LoggerService } from './services/s3/s3-logger.service';

@Module({
  imports: [ConfigModule],
  providers: [S3Service, S3LoggerService],
  exports: [S3Service, S3LoggerService],
})
export class AwsModule {}
