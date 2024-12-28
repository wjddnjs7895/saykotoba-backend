import { IsArray, IsBoolean, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class MissionResult {
  @IsString()
  missionId: number;

  @IsString()
  mission: string;

  @IsBoolean()
  isCompleted: boolean;
}

class SuggestedReply {
  @IsString()
  japanese: string;

  @IsString()
  meaning: string;
}

export class GenerateResponseDto {
  @IsString()
  response: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MissionResult)
  missionResults: MissionResult[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SuggestedReply)
  suggestedReplies: SuggestedReply[];
}
