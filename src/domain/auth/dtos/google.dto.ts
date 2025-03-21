import { IsBoolean, IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { TokenResponseDto } from './token.dto';

export class GoogleLoginRequestDto {
  @IsString()
  @IsNotEmpty()
  idToken: string;
}

export class GoogleLoginResponseDto extends TokenResponseDto {
  @IsBoolean()
  isOnboardingCompleted: boolean;

  @IsString()
  email: string;

  @IsNumber()
  userId: number;
}

export class GoogleTokenPayloadDto {
  @IsString()
  sub: string;

  @IsString()
  email: string;

  @IsString()
  name: string;
}
