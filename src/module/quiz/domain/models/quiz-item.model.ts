import { QuizType } from '@/common/enums/quiz-type.enum';

export class QuizItem {
  private itemId: number;
  private type: QuizType;
  private isCorrect: boolean;
  private attemptCount: number;
  private lastAttempt: Date;

  constructor({ itemId, type }: { itemId: number; type: QuizType }) {
    this.itemId = itemId;
    this.type = type;
    this.isCorrect = false;
    this.attemptCount = 0;
    this.lastAttempt = null;
  }

  getIsCorrect(): boolean {
    return this.isCorrect;
  }
}
