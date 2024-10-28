import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('conversation')
export class ConversationEntity extends BaseEntity {
  @Column()
  userId: number;

  @Column()
  difficulty: number;

  @Column()
  situation: string;

  @Column('text', { array: true })
  missions: string[];
}
