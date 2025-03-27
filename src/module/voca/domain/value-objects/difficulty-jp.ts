import { BaseDifficulty } from './base-difficulty';

export class DifficultyJp extends BaseDifficulty {
  constructor(private readonly level: number) {
    super();
  }

  getLevel(): number {
    return this.level;
  }

  toString(): string {
    // 일본어 기준 난이도 문자열 반환
    return `JP 난이도 ${this.level}`;
  }
}
