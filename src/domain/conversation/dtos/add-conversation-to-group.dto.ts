import { IsNumber, IsArray } from 'class-validator';

export class AddConversationToGroupRequestDto {
  @IsArray()
  @IsNumber({}, { each: true })
  conversationIds: number[];

  @IsNumber()
  groupId: number;
}
