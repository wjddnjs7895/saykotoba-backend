import { IsArray, IsString } from 'class-validator';
import { MissionEntity } from '../entities/mission.entity';

export class ChatResponseDto {
  @IsString()
  userMessage: string;

  @IsString()
  assistantMessage: string;

  @IsArray()
  missions: MissionEntity[];
}
