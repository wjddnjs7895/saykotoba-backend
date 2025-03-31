import { QuizSessionEntity } from '../../infrastructure/entities/quiz-session.entity';

export interface IQuizRepository {
  save({ quizSession }: { quizSession: QuizSessionEntity }): Promise<void>;

  findById({ id }: { id: number }): Promise<QuizSessionEntity | null>;

  findByUserId({ userId }: { userId: number }): Promise<QuizSessionEntity[]>;

  update({
    quizSession,
  }: {
    quizSession: QuizSessionEntity;
  }): Promise<QuizSessionEntity>;

  delete({ id }: { id: number }): Promise<void>;
}
