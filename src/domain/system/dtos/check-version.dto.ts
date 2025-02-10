import { IsNotEmpty, IsString } from 'class-validator';

export class VersionCheckRequestDto {
  @IsString()
  @IsNotEmpty()
  platform: 'ios' | 'android';

  @IsString()
  @IsNotEmpty()
  currentVersion: string;
}

export class VersionCheckResponseDto {
  isLatest: boolean;
  latestVersion: string;
  forceUpdate: boolean;
  storeUrl?: string;
}
