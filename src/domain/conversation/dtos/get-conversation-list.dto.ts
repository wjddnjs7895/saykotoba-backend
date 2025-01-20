import { CONVERSATION_TYPE } from '@/common/constants/conversation.constants';
import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';

export class GetConversationListResponseDto {
  @IsNumber()
  conversationId: number;

  @IsString()
  title: string;

  @IsNumber()
  difficultyLevel: number;

  @IsString()
  thumbnailUrl?: string;

  @IsEnum(CONVERSATION_TYPE)
  type: CONVERSATION_TYPE;

  @IsBoolean()
  isCompleted: boolean;

  @IsNumber()
  score: number;
}
