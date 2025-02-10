import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MessageEntity } from '@/domain/conversation/entities/message.entity';

export class HintDto {
  @IsString()
  hint: string;

  @IsString()
  reading: string;

  @IsString()
  meaning: string;
}

export class GenerateHintRequestDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => MessageEntity)
  messages: MessageEntity[];

  @IsNumber()
  @IsNotEmpty()
  difficultyLevel: number;

  @IsString()
  @IsNotEmpty()
  language: string = 'en';
}

export class GenerateHintResponseDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => HintDto)
  hints: HintDto[];
}
