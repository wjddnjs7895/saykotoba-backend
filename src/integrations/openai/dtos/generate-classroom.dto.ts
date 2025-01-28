import { Language } from '@/common/constants/app.constants';
import { CLASSROOM_STYLE } from '@/common/constants/classroom.constants';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class Mission {
  @IsNumber()
  id: number;

  @IsString()
  mission: string;
}

class Lesson {
  @IsString()
  title: string;

  @IsString()
  situation: string;

  @IsString()
  aiRole: string;

  @IsString()
  userRole: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Mission)
  missions: {
    id: number;
    mission: string;
  }[];

  @IsNumber()
  difficultyLevel: number;
}

class Lecture {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  difficultyLevelStart: number;

  @IsNumber()
  difficultyLevelEnd: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Lesson)
  lessons: Lesson[];
}

export class GenerateClassroomRequestDto {
  @IsNumber()
  difficultyLevel: number;

  @IsEnum(CLASSROOM_STYLE)
  style: CLASSROOM_STYLE;

  @IsArray()
  @IsString({ each: true })
  interests: string[];

  @IsString()
  requiredStatement: string;

  @IsEnum(Language)
  language: Language;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Lecture)
  lectures: Lecture[];
}

export class GenerateClassroomResponseDto {
  @IsString()
  title: string;

  @IsArray()
  @IsNumber({}, { each: true })
  lectureIds: number[];
}
