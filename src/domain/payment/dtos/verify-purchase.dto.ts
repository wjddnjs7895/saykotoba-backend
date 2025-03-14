export class VerifyPurchaseRequestDto {
  receipt: any;
  platform: 'GOOGLE' | 'APPLE';
}

export class VerifyPurchaseServiceDto extends VerifyPurchaseRequestDto {
  userId: number;
}

export class VerifyPurchaseResponseDto {
  success: boolean;
}
