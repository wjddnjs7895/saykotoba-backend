import { VocaAggregate } from '../aggregates/voca.aggregate';
import { LanguageCode } from '@/common/enums/language-code.enum';

export interface VocaRepository {
  // 기본 CRUD 작업
  findById(id: string): Promise<VocaAggregate | null>;
  save(voca: VocaAggregate): Promise<void>;
  delete(id: string): Promise<void>;

  // 도메인 특화 쿼리
  findByWord(word: string): Promise<VocaAggregate[]>;
  findByLanguage(languageCode: LanguageCode): Promise<VocaAggregate[]>;
  findByDifficulty(
    languageCode: LanguageCode,
    difficulty: number,
  ): Promise<VocaAggregate[]>;

  // 집계 쿼리
  countByLanguage(languageCode: LanguageCode): Promise<number>;
}
