import { CONVERSATION_TYPE } from '@/common/constants/conversation.constants';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateConversationRequestDto {
  @IsString()
  title: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  difficultyLevel: number;

  @IsString()
  situation: string;

  @IsArray()
  @IsString({ each: true })
  missions: string[];

  @IsString()
  aiRole: string;

  @IsString()
  userRole: string;

  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @IsEnum(CONVERSATION_TYPE)
  @IsOptional()
  type?: CONVERSATION_TYPE;

  @IsNumber()
  @IsOptional()
  problemId?: number;

  @IsOptional()
  @IsString()
  characteristic?: string;

  @IsNumber()
  @IsOptional()
  exp?: number;
}

export interface CreateConversationServiceDto
  extends CreateConversationRequestDto {
  userId: number;
}

export class CreateConversationResponseDto {
  @IsNumber()
  conversationId: number;
}
