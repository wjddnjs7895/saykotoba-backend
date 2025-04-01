import { VocaEn } from '../models/voca-en.model';
import { VocaEnEntity } from '../../infrastructure/entities/voca-en.entity';
import { DifficultyEn } from '../value-objects/difficulty-en';
import { IVocaMapperStrategy } from '../interfaces/voca-mapper-strategy.interface';

export class VocaEnMapperStrategy
  implements IVocaMapperStrategy<VocaEn, VocaEnEntity>
{
  toEntity({ voca }: { voca: VocaEn }): VocaEnEntity {
    const entity = new VocaEnEntity();
    entity.id = voca.id;
    entity.word = voca.word;
    entity.reading = voca.reading;
    entity.example_reading = voca.exampleReading;
    entity.difficulty = voca.difficulty as DifficultyEn;
    entity.createdAt = voca.createdAt;
    return entity;
  }

  toModel({ voca }: { voca: VocaEnEntity }): VocaEn {
    return new VocaEn({
      vocaId: voca.id,
      word: voca.word,
      reading: voca.reading,
      exampleReading: voca.example_reading,
      difficulty: voca.difficulty as DifficultyEn,
      createdAt: voca.createdAt,
    });
  }
}
