import { BaseEntity } from 'src/common/entities/base.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import { MissionEntity } from './mission.entity';
import { MessageEntity } from './message.entity';
import { FeedbackEntity } from './feedback.entity';
import { ConversationGroupEntity } from './conversation_group.entity';
import { LectureEntity } from '@/domain/lecture/entities/lecture.entity';

enum ConversationType {
  NORMAL,
}

@Entity('conversation')
export class ConversationEntity extends BaseEntity {
  @Column({ name: 'problem_id', nullable: true })
  problemId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'ai_role' })
  aiRole: string;

  @Column({ name: 'user_role' })
  userRole: string;

  @Column({ name: 'difficulty_level' })
  difficultyLevel: number;

  @Column({ name: 'situation' })
  situation: string;

  @Column({ name: 'restriction', default: '' })
  restriction: string;

  @Column({ name: 'is_completed', default: false })
  isCompleted: boolean;

  @Column({ name: 'score', default: 0 })
  score: number;

  @OneToMany(() => MissionEntity, (mission) => mission.conversation)
  missions: MissionEntity[];

  @OneToMany(() => MessageEntity, (message) => message.conversation)
  messages: MessageEntity[];

  @OneToOne(() => FeedbackEntity, (feedback) => feedback.conversation)
  feedback: FeedbackEntity;

  @Column({ name: 'thumbnail_url', nullable: true })
  thumbnailUrl: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'exp', default: 0 })
  exp: number;

  @Column({ name: 'type', default: ConversationType.NORMAL })
  type: ConversationType;

  @Column({ name: 'remaining_hint_count', default: 3 })
  remainingHintCount: number;

  @ManyToMany(() => LectureEntity, (lecture) => lecture.conversations, {
    nullable: true,
  })
  lectures: LectureEntity[];

  @ManyToOne(() => ConversationGroupEntity, (group) => group.conversations, {
    nullable: true,
  })
  group: ConversationGroupEntity;
}
