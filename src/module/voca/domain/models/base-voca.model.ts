import { BaseModel } from '@/common/base/base.model';
import { BaseDifficulty } from '../value-objects/base-difficulty';

export abstract class BaseVoca extends BaseModel {
  private _word: string;
  private _reading: string;
  private _exampleReading: string;
  protected _difficulty: BaseDifficulty;

  constructor({
    vocaId,
    word,
    reading,
    exampleReading,
    createdAt,
  }: {
    vocaId: number;
    word: string;
    reading: string;
    exampleReading: string;
    createdAt: Date;
  }) {
    super({ id: vocaId, createdAt });
    this._word = word;
    this._reading = reading;
    this._exampleReading = exampleReading;
  }

  get word(): string {
    return this._word;
  }

  get reading(): string {
    return this._reading;
  }

  get exampleReading(): string {
    return this._exampleReading;
  }

  get difficulty(): BaseDifficulty {
    return this._difficulty;
  }
}
