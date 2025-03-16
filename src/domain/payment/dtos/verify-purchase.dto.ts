import { Platform } from '@/common/types/system';
import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';

class GoogleReceipt {
  @IsString()
  packageName: string;

  @IsString()
  productId: string;

  @IsString()
  purchaseToken: string;
}

export class VerifyPurchaseRequestDto {
  receipt: GoogleReceipt | string;

  @IsEnum(Platform)
  platform: Platform;
}

export class VerifyPurchaseServiceDto extends VerifyPurchaseRequestDto {
  @IsNumber()
  userId: number;
}

export class VerifyPurchaseResponseDto {
  @IsBoolean()
  success: boolean;
}
