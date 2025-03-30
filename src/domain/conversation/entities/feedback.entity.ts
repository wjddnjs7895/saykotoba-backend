import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { ConversationEntity } from './conversation.entity';
import { BaseEntity } from '@/common/base/base.entity';

@Entity('feedback')
export class FeedbackEntity extends BaseEntity {
  @Column({ name: 'conversation_id' })
  conversationId: number;

  @Column({ name: 'better_expression', type: 'jsonb' })
  betterExpressions: {
    sentence: string;
    betterExpression: string;
    reading: string;
    feedback: string;
  }[];

  @Column({ name: 'difficult_word', type: 'jsonb' })
  difficultWords: {
    word: string;
    reading: string;
    meaning: string;
  }[];

  @OneToOne(() => ConversationEntity, (conversation) => conversation.id)
  @JoinColumn({ name: 'conversation_id' })
  conversation: ConversationEntity;
}
