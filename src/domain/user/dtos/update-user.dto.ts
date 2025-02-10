import { IsNumber, IsString, Length } from 'class-validator';

export class UpdateUserRequestDto {
  @IsString()
  @Length(8, 20)
  password: string;
}

export class UpdateUserResponseDto {
  @IsNumber()
  userId: number;
}
