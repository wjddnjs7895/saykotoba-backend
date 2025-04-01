import { BaseVoca } from '../models/base-voca.model';
import { BaseDifficulty } from '../value-objects/base-difficulty';

export interface IVocaRepositoryStrategy {
  findByDifficulty({
    difficulty,
  }: {
    difficulty: BaseDifficulty;
  }): Promise<BaseVoca[]>;
}
