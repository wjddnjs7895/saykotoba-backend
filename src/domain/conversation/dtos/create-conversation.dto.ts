import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateConversationRequestDto {
  @IsString()
  title: string;

  @IsNumber()
  difficulty: number;

  @IsString()
  situation: string;

  @IsArray()
  @IsString({ each: true })
  missions: string[];
}

export interface CreateConversationServiceDto
  extends CreateConversationRequestDto {
  userId: number;
}

export class CreateConversationResponseDto {
  @IsNumber()
  conversationId: number;
}
