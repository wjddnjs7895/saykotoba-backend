export abstract class VocaLanguageDetail {
  abstract languageCode: string;
  abstract reading: string;
  abstract meaning: string;

  abstract getFormattedInfo(): string;
}

export class VocaAggregate {
  private readonly id: string;
  private readonly word: string;
  private languageDetails: Map<string, VocaLanguageDetail>;

  constructor(id: string, word: string) {
    this.id = id;
    this.word = word;
    this.languageDetails = new Map();
  }

  // 서브 모델 추가
  addLanguageDetail(detail: VocaLanguageDetail): void {
    this.languageDetails.set(detail.languageCode, detail);
  }

  // 특정 언어의 서브 모델 조회
  getLanguageDetail(languageCode: string): VocaLanguageDetail | undefined {
    return this.languageDetails.get(languageCode);
  }

  // 전체 단어 정보와 서브 모델 정보를 통합하여 비즈니스 로직 수행 가능
  getFullInfo(): string {
    let detailsInfo = '';
    for (const detail of this.languageDetails.values()) {
      detailsInfo += detail.getFormattedInfo() + '\n';
    }
    return `Word: ${this.word}\n${detailsInfo}`;
  }
}
