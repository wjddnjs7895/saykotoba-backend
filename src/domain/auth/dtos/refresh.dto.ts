import { IsString } from 'class-validator';

export class RefreshRequestDto {
  @IsString()
  refreshToken: string;
}

export class RefreshResponseDto {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}
