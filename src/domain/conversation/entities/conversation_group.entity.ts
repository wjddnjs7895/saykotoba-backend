import { BaseEntity } from '@/common/entities/base.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { ConversationEntity } from './conversation.entity';
import { UserEntity } from '@/domain/user/entities/user.entity';

@Entity('conversation_group')
export class ConversationGroupEntity extends BaseEntity {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'description', default: '' })
  description: string;

  @Column({ name: 'thumbnail_url', default: '' })
  thumbnailUrl: string;

  @OneToMany(() => ConversationEntity, (conversation) => conversation.group)
  conversations: ConversationEntity[];

  @OneToOne(() => UserEntity, (user) => user.conversationGroup)
  user: UserEntity;
}
