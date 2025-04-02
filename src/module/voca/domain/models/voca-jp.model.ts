import { DifficultyJp } from '../value-objects/difficulty-jp';
import { BaseVoca } from './base-voca.model';

export class VocaJp extends BaseVoca {
  constructor({
    vocaId,
    word,
    reading,
    exampleReading,
    difficulty,
    createdAt,
  }: {
    vocaId: number;
    word: string;
    reading: string;
    exampleReading: string;
    difficulty: DifficultyJp;
    createdAt: Date;
  }) {
    super({ vocaId, word, reading, exampleReading, createdAt });
    this._difficulty = difficulty;
  }
}
