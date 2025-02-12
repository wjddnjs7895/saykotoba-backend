import { IsArray, IsNumber, IsString } from 'class-validator';

export class GetFirstMessageDto {
  @IsString()
  title: string;

  @IsString()
  situation: string;

  @IsArray()
  @IsString({ each: true })
  missions: string[];

  @IsNumber()
  difficultyLevel: number;

  @IsString()
  aiRole: string;

  @IsString()
  userRole: string;

  @IsString()
  characteristic: string;
}

export class GetFirstMessageResponseDto {
  @IsString()
  response: string;

  @IsString()
  meaning: string;
}
