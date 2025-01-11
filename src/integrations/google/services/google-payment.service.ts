import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GooglePaymentService {
  constructor(private readonly configService: ConfigService) {}

  async verifyPurchase(userId: number, receipt: string) {
    const response = await fetch(
      `https://www.googleapis.com/androidpublisher/v3/applications/com.saykotoba.app/purchases/subscriptions/${receipt}/tokens/${userId}?key=${this.configService.get<string>('GOOGLE_TTS_API_KEY')}`,
      {
        headers: {
          Authorization: `Bearer ${this.configService.get<string>('GOOGLE_API_KEY')}`,
        },
      },
    );
    const data = await response.json();
    if (data.expiryTimeMillis) {
      return true;
    }
    return false;
  }
}
