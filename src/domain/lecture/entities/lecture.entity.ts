import { BaseEntity } from '@/common/entities/base.entity';
import { ConversationEntity } from '@/domain/conversation/entities/conversation.entity';
import {
  Column,
  Entity,
  ManyToMany,
  UpdateDateColumn,
  JoinTable,
} from 'typeorm';

@Entity('lecture')
export class LectureEntity extends BaseEntity {
  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'thumbnail_url', nullable: true })
  thumbnailUrl: string;

  @Column({ name: 'difficulty_level', default: 1 })
  difficultyLevel: number;

  @Column({ name: 'is_completed', default: false })
  isCompleted: boolean;

  @Column({ name: 'progress', default: 0 })
  progress: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(
    () => ConversationEntity,
    (conversation) => conversation.lectures,
    {
      nullable: true,
    },
  )
  @JoinTable({
    name: 'lecture_conversation',
    joinColumn: { name: 'lecture_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'conversation_id', referencedColumnName: 'id' },
  })
  conversations: ConversationEntity[];
}
