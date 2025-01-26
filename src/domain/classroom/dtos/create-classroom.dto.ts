import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';
import { CLASSROOM_STYLE } from '@/common/constants/classroom.constants';
import { Language } from '@/common/constants/app.constants';

export class CreateClassroomRequestDto {
  @IsNumber()
  difficultyLevel: number;

  @IsEnum(CLASSROOM_STYLE)
  style: CLASSROOM_STYLE;

  @IsArray()
  @IsString({ each: true })
  topics: string[];

  @IsEnum(Language)
  language: Language;

  @IsString()
  requiredStatement: string;
}

export class CreateClassroomServiceDto extends CreateClassroomRequestDto {
  @IsNumber()
  userId: number;
}

export class CreateClassroomResponseDto {
  @IsNumber()
  classroomId: number;
}
