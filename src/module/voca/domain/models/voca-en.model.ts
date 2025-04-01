import { DifficultyEn } from '../value-objects/difficulty-en';
import { BaseVoca } from './base-voca.model';

export class VocaEn extends BaseVoca {
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
    difficulty: DifficultyEn;
    createdAt: Date;
  }) {
    super({ vocaId, word, reading, exampleReading, createdAt });
    this._difficulty = difficulty;
  }
}
