import { VocaJpEntity } from '../../infrastructure/entities/voca-jp.entity';
import { IVocaMapperStrategy } from '../interfaces/voca-mapper-strategy.interface';
import { VocaJp } from '../models/voca-jp.model';
import { DifficultyJp } from '../value-objects/difficulty-jp';

export class VocaJpMapperStrategy
  implements IVocaMapperStrategy<VocaJp, VocaJpEntity>
{
  toEntity({ voca }: { voca: VocaJp }): VocaJpEntity {
    const entity = new VocaJpEntity();
    entity.id = voca.id;
    entity.word = voca.word;
    entity.reading = voca.reading;
    entity.example_reading = voca.exampleReading;
    entity.difficulty = voca.difficulty as DifficultyJp;
    entity.createdAt = voca.createdAt;
    return entity;
  }

  toModel({ voca }: { voca: VocaJpEntity }): VocaJp {
    return new VocaJp({
      vocaId: voca.id,
      word: voca.word,
      reading: voca.reading,
      exampleReading: voca.example_reading,
      difficulty: voca.difficulty as DifficultyJp,
      createdAt: voca.createdAt,
    });
  }
}
