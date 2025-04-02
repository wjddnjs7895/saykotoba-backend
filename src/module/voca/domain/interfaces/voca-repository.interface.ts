import { VocaAggregate } from '../aggregates/voca.aggregate';
import { LanguageCode } from '@/common/enums/language-code.enum';

export interface IVocaRepository {
  // 기본 CRUD 작업
  findById({
    id,
    languageCode,
  }: {
    id: number;
    languageCode: LanguageCode;
  }): Promise<VocaAggregate | null>;
  save({ voca }: { voca: VocaAggregate }): Promise<void>;
  delete({ id }: { id: number }): Promise<void>;

  // 도메인 특화 쿼리
  findByWord({ word }: { word: string }): Promise<VocaAggregate[]>;
  findByLanguage({
    languageCode,
  }: {
    languageCode: LanguageCode;
  }): Promise<VocaAggregate[]>;
  findByDifficulty({
    languageCode,
    difficulty,
  }: {
    languageCode: LanguageCode;
    difficulty: number;
  }): Promise<VocaAggregate[]>;
}
