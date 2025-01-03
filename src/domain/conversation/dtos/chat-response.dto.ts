import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { MissionEntity } from '../entities/mission.entity';
import { Type } from 'class-transformer';

class MessageDto {
  @IsNumber()
  id: number;

  @IsString()
  message: string;

  @IsBoolean()
  isUser: boolean;

  @IsDate()
  createdAt: Date;
}

export class ChatResponseDto {
  @IsObject()
  @ValidateNested()
  @Type(() => MessageDto)
  userMessage: MessageDto;

  @IsObject()
  @ValidateNested()
  @Type(() => MessageDto)
  assistantMessage: MessageDto;

  @IsString()
  audioUrl: string;

  @IsArray()
  missions: MissionEntity[];
}
