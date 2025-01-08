import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class MissionDto {
  @IsString()
  mission: string;

  @IsBoolean()
  isCompleted: boolean;
}

class BetterExpressionDto {
  @IsString()
  sentence: string;

  @IsString()
  betterExpression: string;

  @IsString()
  reading: string;

  @IsString()
  feedback: string;
}

class DifficultWordDto {
  @IsString()
  word: string;

  @IsString()
  reading: string;

  @IsString()
  meaning: string;
}

class FeedbackDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BetterExpressionDto)
  betterExpressions: BetterExpressionDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DifficultWordDto)
  difficultWords: DifficultWordDto[];
}

export class GetConversationInfoResponseDto {
  @IsString()
  title: string;

  @IsString()
  situation: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MissionDto)
  missions: MissionDto[];

  @IsNumber()
  difficultyLevel: number;

  @IsString()
  aiRole: string;

  @IsString()
  userRole: string;

  @IsNumber()
  remainingHintCount: number;

  @IsNumber()
  score: number;

  @IsBoolean()
  isCompleted: boolean;

  @IsObject()
  @ValidateNested()
  @Type(() => FeedbackDto)
  feedback: FeedbackDto;
}
