import { BaseEntity } from '@/common/entities/base.entity';
import { ConversationGroupEntity } from '@/domain/conversation/entities/conversation_group.entity';
import { UserEntity } from '@/domain/user/entities/user.entity';
import { Entity, ManyToMany, ManyToOne } from 'typeorm';

@Entity({ name: 'classroom' })
export class ClassroomEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.classrooms)
  user: UserEntity;

  @ManyToMany(
    () => ConversationGroupEntity,
    (conversationGroup) => conversationGroup.classrooms,
  )
  conversationGroups: {
    conversationGroup: ConversationGroupEntity;
    isCompleted: boolean;
  }[];
}
