import { IsArray, IsString } from 'class-validator';
import { MissionEntity } from '../entities/mission.entity';

class SuggestedReply {
  @IsString()
  japanese: string;

  @IsString()
  meaning: string;
}

export class ChatResponseDto {
  @IsString()
  userMessage: string;

  @IsString()
  assistantMessage: string;

  @IsArray()
  missions: MissionEntity[];

  @IsArray()
  suggestedReplies: SuggestedReply[];
}
