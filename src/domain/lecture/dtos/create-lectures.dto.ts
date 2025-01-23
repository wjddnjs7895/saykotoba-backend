import { Language } from '@/common/constants/app.constants';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class LessonDto {
  @IsString()
  title: string;

  @IsString()
  aiRole: string;

  @IsString()
  userRole: string;

  @IsNumber()
  difficultyLevel: number;

  @IsString()
  situation: string;

  @IsString()
  restriction: string;

  @IsArray({ each: true })
  @Type(() => Number)
  missions: {
    id: number;
    mission: string;
  }[];

  @IsNumber()
  exp: number;
}

export class CreateLectureRequestDto {
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

  @IsEnum(Language)
  language: Language;

  @IsArray({ each: true })
  @ValidateNested()
  @Type(() => LessonDto)
  lessons: LessonDto[];

  @IsString()
  topic: string;
}

export class CreateLecturesResponseDto {
  @IsArray()
  @IsNumber({}, { each: true })
  lectureIds: number[];
}
