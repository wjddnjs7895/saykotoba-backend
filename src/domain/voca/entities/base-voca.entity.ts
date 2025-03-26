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
  reading: string;

  @Column()
  example: string;

  @Column()
  example_meaning: string;

  @Column()
  example_reading: string;

  abstract difficulty: BaseDifficulty;
}
