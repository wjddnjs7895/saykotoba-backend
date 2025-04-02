import { IQuizRepository } from '../../domain/repositories/quiz-repository.interface';
import { Injectable } from '@nestjs/common';
import { QuizItemRepository } from './quiz-item.repository';
import { QuizSessionRepository } from './quiz-session.repository';
import { QuizSessionEntity } from '../entities/quiz-session.entity';
@Injectable()
export class QuizRepositoryImpl implements IQuizRepository {
  constructor(
    private readonly quizSessionRepository: QuizSessionRepository,
    private readonly quizItemRepository: QuizItemRepository,
  ) {}

  async findById({ id }: { id: number }): Promise<QuizSessionEntity | null> {
    return this.quizSessionRepository.findById({ id });
  }

  async findByUserId({
    userId,
  }: {
    userId: number;
  }): Promise<QuizSessionEntity[]> {
    return this.quizSessionRepository.findByUserId({ userId });
  }

  async update({
    quizSession,
  }: {
    quizSession: QuizSessionEntity;
  }): Promise<QuizSessionEntity> {
    return this.quizSessionRepository.update({
      id: quizSession.id,
      entity: quizSession,
    });
  }

  async delete({ id }: { id: number }): Promise<void> {
    await this.quizSessionRepository.delete({ id });
  }

  async save({
    quizSession,
  }: {
    quizSession: QuizSessionEntity;
  }): Promise<void> {
    await this.quizSessionRepository.save({ entity: quizSession });
  }
}
