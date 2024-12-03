import { IsArray, IsBoolean, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class MissionDto {
  @IsString()
  mission: string;

  @IsBoolean()
  isCompleted: boolean;
}

export class GetConversationInfoResponseDto {
  @IsString()
  title: string;

  @IsString()
  situation: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MissionDto)
  missions: MissionDto[];
}
