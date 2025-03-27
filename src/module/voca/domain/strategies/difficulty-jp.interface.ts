import { Injectable } from '@nestjs/common';
import { DifficultyStrategy } from './difficulty-strategy.interface';

@Injectable()
export class DifficultyJpStrategy implements DifficultyStrategy {
  parseDifficulty(value: any): string {
    // 예시: 숫자 값을 받아 일본어 난이도 등급으로 변환
    switch (value) {
      case 1:
        return 'N5';
      case 2:
        return 'N4';
      case 3:
        return 'N3';
      case 4:
        return 'N2';
      case 5:
        return 'N1';
      default:
        return 'N5';
    }
  }

  validateDifficulty(value: any): boolean {
    return [1, 2, 3, 4, 5].includes(value);
  }
}
