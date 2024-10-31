import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ConversationEntity } from './conversation.entity';

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
}

@Entity('message')
export class MessageEntity extends BaseEntity {
  @Column({ name: 'conversation_id' })
  conversationId: number;

  @Column({ name: 'message_text', type: 'text' })
  messageText: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: MessageRole,
  })
  role: MessageRole;

  @ManyToOne(() => ConversationEntity, (conversation) => conversation.messages)
  @JoinColumn({ name: 'conversation_id' })
  conversation: ConversationEntity;
}
