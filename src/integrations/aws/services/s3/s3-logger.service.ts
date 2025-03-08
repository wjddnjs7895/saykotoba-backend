import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3LoggerService {
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_S3_SECRET_ACCESS_KEY'),
      },
    });
  }

  async uploadLog(
    key: string,
    logContent: string,
  ): Promise<PutObjectCommandOutput> {
    const params: PutObjectCommandInput = {
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key:
        this.configService.get('NODE_ENV') === 'production'
          ? 'logs/' + key
          : 'logs-dev/' + key,
      Body: logContent,
      ContentType: 'text/plain',
    };
    return this.s3Client.send(new PutObjectCommand(params));
  }
}
