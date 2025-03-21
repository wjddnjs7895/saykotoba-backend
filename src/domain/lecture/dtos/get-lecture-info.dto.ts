import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

export class GetLectureInfoResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  thumbnailUrl: string;

  @IsNumber()
  difficultyLevelStart: number;

  @IsNumber()
  difficultyLevelEnd: number;

  @IsBoolean()
  isCompleted: boolean;

  @IsNumber()
  progress: number;

  @IsArray({ each: true })
  @Type(() => Number)
  lessons: {
    id: number;
    title: string;
    difficultyLevel: number;
    thumbnailUrl: string;
  }[];
}
