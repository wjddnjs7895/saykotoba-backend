import { PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { BaseDifficulty } from '../value-objects/base-difficulty';

export abstract class BaseVocaEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  word: string;

  @Column()
  meaning: string;

  @Column()
  example: string;

  @Column()
  example_meaning: string;

  @Column()
  languageCode: string;

  abstract difficulty: BaseDifficulty;

  isMeaningCorrect({ meaning }: { meaning: string }): boolean {
    return this.meaning === meaning;
  }

  abstract getFormattedInfo(): string;
}
