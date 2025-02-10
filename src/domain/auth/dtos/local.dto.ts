import { IsEmail, IsString } from 'class-validator';
import { TokenResponseDto } from './token.dto';

export class LocalLoginRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class LocalLoginResponseDto extends TokenResponseDto {}
