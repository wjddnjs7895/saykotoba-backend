import { BaseEntity } from '@/common/base/base.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { ConversationEntity } from './conversation.entity';

@Entity('mission')
export class MissionEntity extends BaseEntity {
  @Column({ name: 'conversation_id' })
  conversationId: number;

  @Column({ name: 'mission' })
  mission: string;

  @Column({ name: 'is_completed', default: false })
  isCompleted: boolean;

  @ManyToOne(() => ConversationEntity, (conversation) => conversation.missions)
  @JoinColumn({ name: 'conversation_id' })
  conversation: ConversationEntity;
}
