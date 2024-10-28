import { IsString, Length, IsEmail } from 'class-validator';

export class RegisterRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 20)
  password: string;
}

export class RegisterResponseDto {
  userId: number;
}
