import { Entity, Column, OneToMany } from 'typeorm';
import { QuizItemEntity } from './quiz-item.entity';
import { BaseEntity } from '@/common/base/base.entity';

@Entity('quiz_session')
export class QuizSessionEntity extends BaseEntity {
  @Column()
  userId: number;

  @Column({ type: 'timestamp' })
  date: Date;

  @OneToMany(() => QuizItemEntity, (quizItem) => quizItem.session, {
    cascade: true,
    eager: true,
  })
  quizItems: QuizItemEntity[];

  constructor({ userId, date }: { userId: number; date: Date }) {
    super();
    this.userId = userId;
    this.date = date;
    this.quizItems = [];
  }
}
