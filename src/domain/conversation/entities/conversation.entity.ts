import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('conversation')
export class ConversationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  createdAt: Date;
}
