import { ConfigService } from '@nestjs/config';

export class AppleUtils {
  constructor(private readonly configService: ConfigService) {}

  validateAppleConfigs() {
    const requiredConfigs = ['APPLE_CLIENT_ID', 'APPLE_TEAM_ID'];

    requiredConfigs.forEach((config) => {
      if (!this.configService.get(config)) {
        throw new Error(`Missing required Apple configuration: ${config}`);
      }
    });
  }
}
