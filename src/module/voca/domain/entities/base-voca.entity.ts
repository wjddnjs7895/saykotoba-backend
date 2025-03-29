import { Column, ManyToOne } from 'typeorm';
import { BaseDifficulty } from '../value-objects/base-difficulty';
import { LanguageCode } from '@/common/enums/language-code.enum';
import { BaseEntity } from '@/common/entities/base.entity';
import { VocaCoreEntity } from './voca-core.entity';

export abstract class BaseVocaEntity extends BaseEntity {
  @ManyToOne(() => VocaCoreEntity)
  vocaId: string;

  @Column()
  word: string;

  @Column()
  meaning: string;

  @Column()
  languageCode: LanguageCode;

  abstract difficulty: BaseDifficulty;

  isMeaningCorrect(meaning: string): boolean {
    return this.meaning === meaning;
  }
}
