import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import {
  ImageUploadRequestDto,
  ImageUploadResponseDto,
} from '../../dtos/image-upload.dto';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private readonly cloudFrontDomain: string;

  constructor(private configService: ConfigService) {
    this.cloudFrontDomain = this.configService.get('AWS_CLOUDFRONT_DOMAIN');

    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_S3_SECRET_ACCESS_KEY'),
      },
    });
  }

  async imageUploadToS3(
    imageUploadRequestDto: ImageUploadRequestDto,
  ): Promise<ImageUploadResponseDto> {
    const fileBuffer = Buffer.isBuffer(imageUploadRequestDto.file)
      ? imageUploadRequestDto.file
      : imageUploadRequestDto.file.buffer;
    const command = new PutObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: imageUploadRequestDto.fileName,
      Body: fileBuffer,
      ContentType: `image/${imageUploadRequestDto.ext}`,
    });

    await this.s3Client.send(command);

    const url = new URL(
      imageUploadRequestDto.fileName,
      `https://${this.cloudFrontDomain}`,
    );

    return {
      imageUrl: url.toString(),
      key: imageUploadRequestDto.fileName,
    };
  }
}
