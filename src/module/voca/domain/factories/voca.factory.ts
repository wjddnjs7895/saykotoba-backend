import { LanguageCode } from '@/common/enums/language-code.enum';
import { BaseVoca } from '../models/base-voca.model';
import { VocaAggregate } from '../aggregates/voca.aggregate';

export class VocaFactory {
  static createVoca({
    voca,
    languageCode,
  }: {
    voca: BaseVoca;
    languageCode: LanguageCode;
  }): VocaAggregate {
    const vocaAggregate = new VocaAggregate({
      id: voca.id,
      word: voca.word,
      createdAt: voca.createdAt,
    });

    vocaAggregate.addLanguageDetail({
      languageCode,
      voca,
    });

    return vocaAggregate;
  }
}
