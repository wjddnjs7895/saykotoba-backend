import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { TokenResponseDto } from './token.dto';

export class AppleLoginRequestDto {
  @IsString()
  idToken: string;

  @IsOptional()
  @IsObject()
  fullName?: {
    firstName?: string;
    lastName?: string;
  };
}

export class AppleLoginResponseDto extends TokenResponseDto {
  @IsBoolean()
  isOnboardingCompleted: boolean;

  @IsString()
  email: string;

  @IsNumber()
  userId: number;
}

export class AppleTokenPayloadDto {
  @IsString()
  iss: string;

  @IsString()
  aud: string;

  @IsNumber()
  exp: number;

  @IsNumber()
  iat: number;

  @IsString()
  sub: string;

  @IsString()
  email: string;
}
