import { QuizSessionAggregate } from '../aggregates/quiz-session.aggregate';
import { QuizItemEntity } from '../../infrastructure/entities/quiz-item.entity';

export class QuizSessionFactory {
  static createQuizSession({
    userId,
    date,
    quizItems,
  }: {
    userId: number;
    date: Date;
    quizItems: QuizItemEntity[];
  }): QuizSessionAggregate {
    const quizSession = new QuizSessionAggregate({ userId, date });
    quizSession.addQuizItems(quizItems);
    return quizSession;
  }
}
