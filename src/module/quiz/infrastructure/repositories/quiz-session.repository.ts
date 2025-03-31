import { BaseRepository } from '@/common/base/base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityNotFoundException } from '@/common/exception/custom-exception/repository.exception';
import { QuizSessionEntity } from '../entities/quiz-session.entity';

export class QuizSessionRepository extends BaseRepository<QuizSessionEntity> {
  constructor(
    @InjectRepository(QuizSessionEntity)
    private readonly quizSessionRepository: Repository<QuizSessionEntity>,
  ) {
    super(quizSessionRepository);
  }

  async findByUserId({
    userId,
  }: {
    userId: number;
  }): Promise<QuizSessionEntity[]> {
    try {
      return this.quizSessionRepository.find({
        where: { userId },
      });
    } catch {
      throw new EntityNotFoundException();
    }
  }
}
