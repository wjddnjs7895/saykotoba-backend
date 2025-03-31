import { BaseEntity } from '@/common/base/base.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { QuizSessionEntity } from './quiz-session.entity';
import { QuizType } from '@/common/enums/quiz-type.enum';

@Entity('quiz_item')
export class QuizItemEntity extends BaseEntity {
  constructor({ itemId, type }: { itemId: number; type: QuizType }) {
    super();
    this.itemId = itemId;
    this.type = type;
  }

  @Column()
  itemId: number;

  @Column({
    type: 'enum',
    enum: QuizType,
    default: QuizType.WORD,
  })
  type: QuizType;

  @Column({ default: false })
  isCorrect: boolean;

  @Column({ type: 'int', default: 0 })
  attemptCount: number;

  @Column({ type: 'timestamp', nullable: true })
  lastAttempt: Date;

  @ManyToOne(() => QuizSessionEntity, (session) => session.quizItems)
  session: QuizSessionEntity;
}
