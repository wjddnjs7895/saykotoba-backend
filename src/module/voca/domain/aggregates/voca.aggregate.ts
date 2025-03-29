import { LanguageCode } from '@/common/enums/language-code.enum';
import { BaseVocaEntity } from '../entities/base-voca.entity';

export class VocaAggregate {
  private readonly id: number;
  private readonly coreWord: string;
  private languageDetails: Map<LanguageCode, BaseVocaEntity>;

  constructor(id: number, word: string) {
    this.id = id;
    this.coreWord = word;
    this.languageDetails = new Map();
  }

  getId(): number {
    return this.id;
  }

  getCoreWord(): string {
    return this.coreWord;
  }

  getSupportedLanguageCodes(): LanguageCode[] {
    return Array.from(this.languageDetails.keys());
  }

  hasLanguage(languageCode: LanguageCode): boolean {
    return this.languageDetails.has(languageCode);
  }

  getLanguageDetail(languageCode: LanguageCode): BaseVocaEntity {
    return this.languageDetails.get(languageCode);
  }

  addLanguageDetail(entity: BaseVocaEntity): void {
    const languageCode = entity.languageCode as LanguageCode;
    if (this.languageDetails.has(languageCode)) {
      throw new Error(`Detail for language ${languageCode} already exists.`);
    }
    this.languageDetails.set(languageCode, entity);
  }

  updateLanguageDetail(entity: BaseVocaEntity): void {
    const languageCode = entity.languageCode as LanguageCode;
    if (!this.languageDetails.has(languageCode)) {
      throw new Error(`Detail for language ${languageCode} does not exist.`);
    }
    this.languageDetails.set(languageCode, entity);
  }

  removeLanguageDetail(languageCode: LanguageCode): void {
    if (!this.languageDetails.has(languageCode)) {
      throw new Error(`Detail for language ${languageCode} does not exist.`);
    }
    this.languageDetails.delete(languageCode);
  }

  checkMeaning(languageCode: LanguageCode, meaning: string): boolean {
    const languageDetail = this.getLanguageDetail(languageCode);
    return languageDetail.isMeaningCorrect(meaning);
  }
}
