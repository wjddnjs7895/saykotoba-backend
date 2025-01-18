import { BaseEntity } from '@/common/entities/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ConversationEntity } from './conversation.entity';
import { UserEntity } from '@/domain/user/entities/user.entity';

export enum ConversationGroupType {
  LECTURE = 'LECTURE',
  CUSTOM = 'CUSTOM',
}

@Entity('conversation_group')
export class ConversationGroupEntity extends BaseEntity {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'description', default: '' })
  description: string;

  @Column({ name: 'thumbnail_url', default: '' })
  thumbnailUrl: string;

  @Column({ name: 'type', default: ConversationGroupType.CUSTOM })
  type: ConversationGroupType;

  @Column({ name: 'difficulty_level', nullable: true })
  difficultyLevel: number;

  @OneToMany(() => ConversationEntity, (conversation) => conversation.group)
  conversations: ConversationEntity[];

  @ManyToOne(() => UserEntity, (user) => user.conversationGroups)
  user: UserEntity;
}
