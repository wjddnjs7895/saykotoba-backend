import { IsNumber, IsString, Length, IsEmail } from 'class-validator';

export class CreateUserRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsNumber()
  userTypeId: number;

  @IsString()
  @Length(8, 20)
  password: string;
}

export class CreateUserResponseDto {
  @IsNumber()
  userId: number;
}
