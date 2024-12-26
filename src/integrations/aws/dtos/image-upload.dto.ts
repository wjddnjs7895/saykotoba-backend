import { IsString } from 'class-validator';

export class ImageUploadRequestDto {
  @IsString()
  fileName: string;

  @IsString()
  file: Express.Multer.File | Buffer;

  @IsString()
  ext: string;
}

export class ImageUploadResponseDto {
  @IsString()
  imageUrl: string;

  @IsString()
  key: string;
}
