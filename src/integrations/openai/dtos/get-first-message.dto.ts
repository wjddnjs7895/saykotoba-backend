import { IsArray, IsString } from 'class-validator';

export class GetFirstMessageDto {
  @IsString()
  title: string;

  @IsString()
  situation: string;

  @IsArray()
  @IsString({ each: true })
  missions: string[];

  @IsString()
  difficulty: string;

  @IsString()
  aiRole: string;

  @IsString()
  userRole: string;
}

export class GetFirstMessageResponseDto {
  @IsString()
  message: string;
}
