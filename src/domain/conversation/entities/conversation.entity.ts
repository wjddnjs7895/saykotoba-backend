import { BaseEntity } from 'src/common/entities/base.entity';
import { ConversationDifficulty } from '@common/constants/conversation.constants';
import { Column, Entity, OneToMany } from 'typeorm';
import { MissionEntity } from './mission.entity';
import { MessageEntity } from './message.entity';

@Entity('conversation')
export class ConversationEntity extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'ai_role' })
  aiRole: string;

  @Column({ name: 'user_role' })
  userRole: string;

  @Column({
    name: 'difficulty',
    type: 'enum',
    enum: ConversationDifficulty,
  })
  difficulty: ConversationDifficulty;

  @Column({ name: 'situation' })
  situation: string;

  @OneToMany(() => MissionEntity, (mission) => mission.conversation)
  missions: MissionEntity[];

  @OneToMany(() => MessageEntity, (message) => message.conversation)
  messages: MessageEntity[];
}
