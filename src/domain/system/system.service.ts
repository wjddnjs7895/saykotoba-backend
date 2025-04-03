import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VersionCheckRequestDto } from './dtos/check-version.dto';
import { LogParams } from '@/common/decorators/log-params.decorator';
import { compare as semverCompare } from 'semver';

@Injectable()
export class SystemService {
  constructor(private readonly configService: ConfigService) {}

  @LogParams()
  async checkVersion(versionCheckDto: VersionCheckRequestDto) {
    const { platform, currentVersion } = versionCheckDto;
    const latestVersion = this.configService.get(
      platform === 'ios' ? 'IOS_LATEST_VERSION' : 'ANDROID_LATEST_VERSION',
    );
    const forceUpdate = this.configService.get(
      platform === 'ios' ? 'IOS_FORCE_UPDATE' : 'ANDROID_FORCE_UPDATE',
    );

    const needsUpdate = semverCompare(currentVersion, latestVersion) < 0;
    const isLatest = semverCompare(currentVersion, latestVersion) >= 0;

    return {
      isLatest: isLatest,
      latestVersion: latestVersion,
      forceUpdate: forceUpdate && needsUpdate,
      storeUrl:
        platform === 'ios'
          ? this.configService.get('IOS_STORE_URL')
          : this.configService.get('ANDROID_STORE_URL'),
    };
  }

  getTermsOfUse(): { url: string } {
    return { url: this.configService.get('TERMS_OF_USE') };
  }

  getPrivacyPolicy(): { url: string } {
    return { url: this.configService.get('PRIVACY_POLICY') };
  }
}
