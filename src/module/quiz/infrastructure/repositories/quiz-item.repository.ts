import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@/common/base/base.repository';
import { QuizItemEntity } from '../entities/quiz-item.entity';

export class QuizItemRepository extends BaseRepository<QuizItemEntity> {
  constructor(
    @InjectRepository(QuizItemEntity)
    private readonly quizItemRepository: Repository<QuizItemEntity>,
  ) {
    super(quizItemRepository);
  }
}
