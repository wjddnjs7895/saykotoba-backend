import { IsString, IsEmail, IsOptional } from 'class-validator';
import { AuthProvider } from '../../users/constants/user.constants';
import { TokenResponseDto } from './token.dto';

export abstract class BaseRegisterRequestDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  name?: string;

  abstract provider: AuthProvider;
}

export class LocalRegisterRequestDto extends BaseRegisterRequestDto {
  @IsString()
  name: string;

  @IsString()
  password: string;

  provider = AuthProvider.LOCAL as const;
}

export class GoogleRegisterRequestDto extends BaseRegisterRequestDto {
  @IsString()
  googleId: string;

  provider = AuthProvider.GOOGLE as const;
}

export class AppleRegisterRequestDto extends BaseRegisterRequestDto {
  @IsString()
  appleId: string;

  provider = AuthProvider.APPLE as const;
}

export class RegisterResponseDto extends TokenResponseDto {}

export type RegisterRequestDto =
  | LocalRegisterRequestDto
  | GoogleRegisterRequestDto
  | AppleRegisterRequestDto;
