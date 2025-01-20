import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class GetConversationGroupInfoResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  thumbnailUrl: string;

  @IsNumber()
  difficultyLevel: number;

  @IsArray({ each: true })
  @Type(() => Number)
  conversations: {
    id: number;
    title: string;
    isCompleted: boolean;
    score: number;
  }[];
}
