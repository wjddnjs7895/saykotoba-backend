import { QuizSessionAggregate } from '../aggregates/quiz-session.aggregate';
import { QuizSessionEntity } from '../../infrastructure/entities/quiz-session.entity';

export class QuizSessionMapper {
  static toEntity({
    domain,
  }: {
    domain: QuizSessionAggregate;
  }): QuizSessionEntity {
    const entity = new QuizSessionEntity({
      userId: domain.getUserId(),
      date: domain.getDate(),
    });
    entity.id = domain.getQuizSessionId();
    if (domain.getQuizItems() && domain.getQuizItems().length > 0) {
      entity.quizItems = domain.getQuizItems();
    }
    return entity;
  }

  static fromEntity({
    entity,
  }: {
    entity: QuizSessionEntity;
  }): QuizSessionAggregate {
    const domain = new QuizSessionAggregate({
      userId: entity.userId,
      date: entity.date,
    });
    if (entity.quizItems && entity.quizItems.length > 0) {
      domain.addQuizItems(entity.quizItems);
    }
    return domain;
  }
}
