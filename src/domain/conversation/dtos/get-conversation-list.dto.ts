import { IsNumber, IsString } from 'class-validator';

export class GetConversationListResponseDto {
  @IsNumber()
  conversationId: number;

  @IsString()
  title: string;
}
