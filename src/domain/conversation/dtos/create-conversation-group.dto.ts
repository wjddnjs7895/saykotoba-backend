import { IsString, IsNumber } from 'class-validator';

export class CreateConversationGroupRequestDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  thumbnailUrl: string;

  @IsNumber()
  difficultyLevel: number;
}

export class CreateConversationGroupResponseDto {
  @IsNumber()
  id: number;
}
