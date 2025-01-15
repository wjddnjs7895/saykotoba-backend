import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApplePaymentService {
  constructor(private readonly configService: ConfigService) {}

  async verifyPurchase(userId: number, receipt: string) {
    const response = await fetch(`https://buy.itunes.apple.com/verifyReceipt`, {
      method: 'POST',
      body: JSON.stringify({
        'receipt-data': receipt,
        password: this.configService.get<string>('APPLE_PASSWORD'),
      }),
    });
    const data = await response.json();
    if (data.status === 0) {
      return true;
    }
    return false;
  }
}
