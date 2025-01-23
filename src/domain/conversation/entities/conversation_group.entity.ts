import { BaseEntity } from '@/common/entities/base.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { ConversationEntity } from './conversation.entity';
import { UserEntity } from '@/domain/user/entities/user.entity';
import { CONVERSATION_GROUP_TYPE } from '@/common/constants/conversation.constants';
import { ClassroomEntity } from '@/domain/classroom/entities/classroom.entity';

@Entity('conversation_group')
export class ConversationGroupEntity extends BaseEntity {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'description', default: '' })
  description: string;

  @Column({ name: 'thumbnail_url', default: '' })
  thumbnailUrl: string;

  @Column({
    type: 'enum',
    enum: CONVERSATION_GROUP_TYPE,
    name: 'type',
    default: CONVERSATION_GROUP_TYPE.CUSTOM,
  })
  type: CONVERSATION_GROUP_TYPE;

  @Column({ name: 'difficulty_level_start', default: 0, nullable: true })
  difficultyLevelStart: number;

  @Column({ name: 'difficulty_level_end', default: 0, nullable: true })
  difficultyLevelEnd: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => ConversationEntity, (conversation) => conversation.group)
  conversations: ConversationEntity[];

  @ManyToOne(() => UserEntity, (user) => user.conversationGroups)
  user: UserEntity;

  @ManyToMany(
    () => ClassroomEntity,
    (classroom) => classroom.conversationGroups,
  )
  classrooms: ClassroomEntity[];
}
