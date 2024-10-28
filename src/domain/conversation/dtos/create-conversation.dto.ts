import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateConversationRequestDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  difficulty: number;

  @IsString()
  situation: string;

  @IsArray()
  @IsString({ each: true })
  missions: string[];
}

export class CreateConversationResponseDto {
  @IsNumber()
  conversationId: number;
}
