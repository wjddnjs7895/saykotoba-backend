import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ConversationGroupDto {
  @IsNumber()
  id: number;

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

  @IsDate()
  updatedAt: Date;

  @IsArray()
  conversations: ConversationDto[];

  @IsBoolean()
  isCompleted: boolean;
}

export class ConversationDto {
  @IsNumber()
  id: number;
  @IsString()
  title: string;
  @IsString()
  situation: string;
  @IsNumber()
  difficultyLevel: number;
  @IsBoolean()
  isCompleted: boolean;
}

export class GetClassroomResponseDto {
  @IsArray()
  @ValidateNested()
  @Type(() => ConversationGroupDto)
  conversationGroups: ConversationGroupDto[];
}
