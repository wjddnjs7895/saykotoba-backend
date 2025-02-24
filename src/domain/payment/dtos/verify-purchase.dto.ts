export class VerifyPurchaseRequestDto {
  receipt: string;
  platform: 'GOOGLE' | 'APPLE';
}

export class VerifyPurchaseResponseDto {
  success: boolean;
}
