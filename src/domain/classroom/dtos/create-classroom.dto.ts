import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Language } from '@/common/constants/app.constants';

export class CreateClassroomRequestDto {
  @IsString()
  name: string;

  @IsNumber()
  difficultyLevel: number;

  @IsNumber()
  style: number;

  @IsArray()
  @IsNumber({}, { each: true })
  interestIds: number[];

  @IsEnum(Language)
  language: Language;

  @IsOptional()
  @IsString()
  requiredStatement?: string;
}

export class CreateClassroomServiceDto extends CreateClassroomRequestDto {
  @IsNumber()
  userId: number;
}

export class CreateClassroomResponseDto {
  @IsNumber()
  classroomId: number;
}
