import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MessageEntity } from '@/domain/conversation/entities/message.entity';

export class AIFeedbackRequestDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageEntity)
  messages: MessageEntity[];

  @IsNotEmpty()
  @IsNumber()
  difficulty: number;

  @IsNotEmpty()
  @IsString()
  language: string;
}

class BetterExpression {
  @IsNotEmpty()
  @IsString()
  sentence: string;

  @IsNotEmpty()
  @IsString()
  betterExpression: string;

  @IsNotEmpty()
  @IsString()
  reading: string;

  @IsNotEmpty()
  @IsString()
  feedback: string;
}

class DifficultWord {
  @IsNotEmpty()
  @IsString()
  word: string;

  @IsNotEmpty()
  @IsString()
  reading: string;

  @IsNotEmpty()
  @IsString()
  meaning: string;
}

export class AIFeedbackResponseDto {
  @IsNumber()
  score: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BetterExpression)
  betterExpressions: BetterExpression[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DifficultWord)
  difficultWords: DifficultWord[];
}
