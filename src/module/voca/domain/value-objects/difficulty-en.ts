import { BaseDifficulty } from './base-difficulty';

export class DifficultyEn extends BaseDifficulty {
  constructor(private readonly level: number) {
    super();
  }

  getLevel(): number {
    return this.level;
  }
}
