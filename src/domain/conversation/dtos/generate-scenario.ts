import { IsArray, IsNumber, IsString, IsEnum } from 'class-validator';

import { ConversationDifficulty } from '@common/constants/conversation.constants';

export class GenerateScenarioRequestDto {
  @IsEnum(ConversationDifficulty)
  difficulty: ConversationDifficulty;

  @IsString()
  topic: string;

  @IsString()
  userRole: string;

  @IsString()
  aiRole: string;
}

export class GenerateScenarioResponseDto {
  @IsNumber()
  difficulty: number;

  @IsString()
  title: string;

  @IsString()
  userRole: string;

  @IsString()
  aiRole: string;

  @IsString()
  scenario: string;

  @IsArray()
  @IsString({ each: true })
  missions: string[];
}
