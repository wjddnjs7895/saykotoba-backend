import { LanguageCode } from '@/common/enums/language-code.enum';
import { BaseVoca } from '../models/base-voca.model';
import { BaseAggregate } from '@/common/base/base.aggregate';

export class VocaAggregate extends BaseAggregate {
  private readonly coreWord: string;
  private languageDetails: Map<LanguageCode, BaseVoca>;

  constructor({
    id,
    word,
    createdAt,
  }: {
    id: number;
    word: string;
    createdAt: Date;
  }) {
    super({ id, createdAt });
    this.coreWord = word;
    this.languageDetails = new Map();
  }

  getCoreWord(): string {
    return this.coreWord;
  }

  addLanguageDetail({
    languageCode,
    voca,
  }: {
    languageCode: LanguageCode;
    voca: BaseVoca;
  }): void {
    this.languageDetails.set(languageCode, voca);
  }
}
