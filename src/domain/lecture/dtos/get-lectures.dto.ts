import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsString,
} from 'class-validator/types/decorator/decorators';

export class GetLecturesResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  thumbnailUrl: string;

  @IsNumber()
  difficultyLevelStart: number;

  @IsNumber()
  difficultyLevelEnd: number;

  @IsString()
  description: string;

  @IsString()
  topic: string;

  @IsArray({ each: true })
  @Type(() => Number)
  lessonIds: number[];
}
