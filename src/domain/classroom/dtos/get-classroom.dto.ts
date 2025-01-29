import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class LectureDto {
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
}

export class GetClassroomResponseDto {
  @IsArray()
  @ValidateNested()
  @Type(() => LectureDto)
  lectures: LectureDto[];
}
