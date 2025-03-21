export class GetConversationMessageRequestDto {
  conversationId: number;
}

export class GetConversationMessageResponseDto {
  id: number;
  message: string;
  meaning?: string;
  isUser: boolean;
  createdAt: Date;
}
