import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MessageEntity } from '@/domain/conversation/entities/message.entity';

export class GetFeedbackRequestDto {
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

class Grammar {
  @IsNotEmpty()
  @IsString()
  sentence: string;

  @IsNotEmpty()
  @IsString()
  feedback: string;
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

export class GetFeedbackResponseDto {
  @IsNumber()
  score: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Grammar)
  grammar: Grammar[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BetterExpression)
  betterExpressions: BetterExpression[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DifficultWord)
  difficultWords: DifficultWord[];
}
