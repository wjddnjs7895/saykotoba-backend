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

export class GenerateResponseDto {
  @IsString()
  response: string;

  @IsString()
  meaning: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MissionResult)
  missionResults: MissionResult[];
}
