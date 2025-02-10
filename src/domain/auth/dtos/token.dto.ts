import { IsEmail, IsNumber, IsString } from 'class-validator';

export class TokenRequestDto {
  @IsNumber()
  userId: number;

  @IsEmail()
  email: string;

  @IsString()
  role: string;
}

export class TokenResponseDto {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}
