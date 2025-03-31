import { QuizItemEntity } from '../../infrastructure/entities/quiz-item.entity';
import { AggregateRoot } from '@nestjs/cqrs';

export class QuizSessionAggregate extends AggregateRoot {
  private quizSessionId: number;
  private userId: number;
  private date: Date;
  private quizItems: QuizItemEntity[];
  constructor({ userId, date }: { userId: number; date: Date }) {
    super();
    this.userId = userId;
    this.date = date;
  }

  getQuizSessionId(): number {
    return this.quizSessionId;
  }

  getUserId(): number {
    return this.userId;
  }

  getDate(): Date {
    return this.date;
  }

  getQuizItems(): QuizItemEntity[] {
    return this.quizItems;
  }

  addQuizItems(quizItems: QuizItemEntity[]): void {
    this.quizItems.push(...quizItems);
  }
}
