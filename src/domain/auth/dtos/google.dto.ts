import { IsString, IsNotEmpty } from 'class-validator';
import { TokenResponseDto } from './token.dto';

export class GoogleLoginRequestDto {
  @IsString()
  @IsNotEmpty()
  idToken: string;
}

export class GoogleLoginResponseDto extends TokenResponseDto {}

export class GoogleTokenPayloadDto {
  @IsString()
  sub: string;

  @IsString()
  email: string;

  @IsString()
  name: string;
}
