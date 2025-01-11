import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ApplePaymentService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private createToken() {
    const issuerId = this.configService.get<string>('APPLE_ISSUER_ID');
    const keyId = this.configService.get<string>('APPLE_KEY_ID');
    const privateKey = this.configService.get<string>('APPLE_PRIVATE_KEY');

    const issuedAt = Math.floor(Date.now() / 1000);
    const expiration = issuedAt + 10 * 60;

    const token = this.jwtService.sign(
      {
        iss: issuerId,
        iat: issuedAt,
        exp: expiration,
        aud: 'appstoreconnect-v1',
        scope: ['GET /v1/apps/:id/inAppPurchases'],
      },
      {
        algorithm: 'ES256',
        kid: keyId,
        privateKey: privateKey,
      },
    );
    return token;
  }

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
