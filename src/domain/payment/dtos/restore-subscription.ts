import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Platform } from '@/common/types/system';

export class RestoreSubscriptionRequestDto {
  @IsString()
  @IsNotEmpty()
  receipt: string;

  @IsString()
  @IsNotEmpty()
  platform: Platform;
}

export class RestoreSubscriptionServiceDto extends RestoreSubscriptionRequestDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}

export class RestoreSubscriptionResponseDto {
  @IsBoolean()
  @IsNotEmpty()
  success: boolean;
}
