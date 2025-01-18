import { IsNumber, IsString } from 'class-validator';

export class GetLectureGroupResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  thumbnailUrl: string;

  @IsNumber()
  difficultyLevel: number;
}
