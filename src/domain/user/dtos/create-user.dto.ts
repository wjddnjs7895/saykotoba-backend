import { AuthProvider } from '@/common/constants/user.constants';
import {
  IsNumber,
  IsString,
  Length,
  IsEmail,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class CreateUserRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  @Length(8, 20)
  @IsOptional()
  password?: string;

  @IsEnum(AuthProvider)
  @IsOptional()
  provider?: AuthProvider;

  @IsString()
  @IsOptional()
  googleId?: string;

  @IsString()
  @IsOptional()
  appleId?: string;
}

export class CreateUserResponseDto {
  @IsNumber()
  userId: number;

  @IsEmail()
  email: string;
}
