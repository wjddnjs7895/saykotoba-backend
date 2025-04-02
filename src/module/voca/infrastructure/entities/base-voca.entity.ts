import { Column, ManyToOne } from 'typeorm';
import { BaseDifficulty } from '../../domain/value-objects/base-difficulty';
import { LanguageCode } from '@/common/enums/language-code.enum';
import { BaseEntity } from '@/common/base/base.entity';
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
}
