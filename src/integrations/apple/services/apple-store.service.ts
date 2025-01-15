import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppleStoreService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private createToken() {
    const issuerId = this.configService.get<string>('APPLE_STORE_ISSUER_ID');
    const keyId = this.configService.get<string>('APPLE_STORE_KEY_ID');
    const privateKey = this.configService.get<string>(
      'APPLE_STORE_PRIVATE_KEY',
    );

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
        privateKey: privateKey,
        header: {
          alg: 'ES256',
          kid: keyId,
          typ: 'JWT',
        },
      },
    );
    return token;
  }
}
