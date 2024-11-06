export class GetConversationMessageRequestDto {
  conversationId: number;
}

export class GetConversationMessageResponseDto {
  id: number;
  message: string;
  isUser: boolean;
  createdAt: Date;
}
