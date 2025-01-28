import { BaseEntity } from '@/common/entities/base.entity';
import { ConversationGroupEntity } from '@/domain/conversation/entities/conversation_group.entity';
import { UserEntity } from '@/domain/user/entities/user.entity';
import { Entity, ManyToMany, ManyToOne, JoinTable, Column } from 'typeorm';

@Entity({ name: 'classroom' })
export class ClassroomEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.classrooms)
  user: UserEntity;

  @ManyToMany(
    () => ConversationGroupEntity,
    (conversationGroup) => conversationGroup.classrooms,
  )
  @JoinTable({
    name: 'classroom_conversation_group',
    joinColumn: {
      name: 'classroom_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'conversation_group_id',
      referencedColumnName: 'id',
    },
  })
  conversationGroups: ConversationGroupEntity[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
