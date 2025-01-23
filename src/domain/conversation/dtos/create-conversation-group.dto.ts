import { CONVERSATION_GROUP_TYPE } from '@/common/constants/conversation.constants';
import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class CreateConversationGroupRequestDto {
  @IsNumber()
  userId: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  thumbnailUrl: string;

  @IsNumber()
  difficultyLevelStart: number;

  @IsNumber()
  difficultyLevelEnd: number;

  @IsEnum(CONVERSATION_GROUP_TYPE)
  type: CONVERSATION_GROUP_TYPE;

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  conversationIds: number[];
}

export class CreateConversationGroupResponseDto {
  @IsNumber()
  groupId: number;
}
