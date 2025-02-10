import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VersionCheckRequestDto } from './dtos/check-version.dto';
@Injectable()
export class SystemService {
  constructor(private readonly configService: ConfigService) {}

  async checkVersion(versionCheckDto: VersionCheckRequestDto) {
    const { platform, currentVersion } = versionCheckDto;
    const latestVersion = this.configService.get(
      platform === 'ios' ? 'IOS_LATEST_VERSION' : 'ANDROID_LATEST_VERSION',
    );
    const forceUpdate = this.configService.get(
      platform === 'ios' ? 'IOS_FORCE_UPDATE' : 'ANDROID_FORCE_UPDATE',
    );
    return {
      isLatest: latestVersion === currentVersion,
      latestVersion: latestVersion,
      forceUpdate: forceUpdate,
      storeUrl:
        platform === 'ios'
          ? this.configService.get('IOS_STORE_URL')
          : this.configService.get('ANDROID_STORE_URL'),
    };
  }
}
