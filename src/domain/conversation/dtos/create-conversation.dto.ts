import { ConversationDifficulty } from '@/common/constants/conversation.constants';
import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateConversationRequestDto {
  @IsString()
  title: string;

  @IsEnum(ConversationDifficulty)
  difficulty: ConversationDifficulty;

  @IsString()
  situation: string;

  @IsArray()
  @IsString({ each: true })
  missions: string[];

  @IsString()
  aiRole: string;

  @IsString()
  userRole: string;
}

export interface CreateConversationServiceDto
  extends CreateConversationRequestDto {
  userId: number;
}

export class CreateConversationResponseDto {
  @IsNumber()
  conversationId: number;
}
