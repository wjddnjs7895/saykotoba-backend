import { IsNumber, IsString, Length, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNumber()
  userTypeId: number;

  @IsString()
  @Length(8, 20)
  password: string;
}
