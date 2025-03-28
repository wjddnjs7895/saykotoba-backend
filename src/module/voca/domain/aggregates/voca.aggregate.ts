import { BaseVocaEntity } from '../entities/base-voca.entity';

export class VocaAggregate {
  private readonly id: string;
  private readonly word: string;
  private translations: Map<string, BaseVocaEntity>;

  constructor(id: string, word: string) {
    this.id = id;
    this.word = word;
    this.translations = new Map();
  }

  // 특정 언어의 상세 정보 추가
  addLanguageDetail(entity: BaseVocaEntity): void {
    if (this.translations.has(entity.languageCode)) {
      throw new Error(
        `Detail for language ${entity.languageCode} already exists.`,
      );
    }
    this.translations.set(entity.languageCode, entity);
  }

  // 특정 언어의 상세 정보 조회
  getLanguageDetail(languageCode: string): BaseVocaEntity | undefined {
    return this.translations.get(languageCode);
  }

  // Aggregate 전체 정보를 포맷팅해서 반환
  getFullInfo(): string {
    let details = '';
    for (const detail of this.translations.values()) {
      details += detail.getFormattedInfo() + '\n';
    }
    return `Word: ${this.word}\n${details}`;
  }
}
