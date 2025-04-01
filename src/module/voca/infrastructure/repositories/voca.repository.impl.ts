import { Injectable } from '@nestjs/common';
import { VocaAggregate } from '../../domain/aggregates/voca.aggregate';
import { LanguageCode } from '@/common/enums/language-code.enum';
import { IVocaRepository } from '../../domain/interfaces/voca-repository.interface';
import { VocaRepositoryStrategyProvider } from '../providers/voca-repository-strategy.provider';

@Injectable()
export class VocaRepositoryImpl implements IVocaRepository {
  constructor(
    private readonly vocaRepositoryStrategyProvider: VocaRepositoryStrategyProvider,
  ) {}

  async findById({
    id,
    languageCode,
  }: {
    id: string;
    languageCode: string;
  }): Promise<VocaAggregate | null> {
    const strategy =
      this.vocaRepositoryStrategyProvider.getStrategy(languageCode);
    const detail = await strategy.findById(id);
    if (!detail) {
      return null;
    }
    // Aggregate 구성은 여기서 매퍼를 통해 수행
    // 예: TestSessionMapper.fromEntity(detail) 같은 방식
    // 간단히 Aggregate 객체를 생성한다고 가정
    const aggregate = new VocaAggregate(detail.id, detail.word);
    aggregate.addLanguageDetail(detail);
    return aggregate;
  }

  async findByWord({ word }: { word: string }): Promise<VocaAggregate[]> {
    return this.vocaJpRepository.findByWord({ word });
  }

  async findByLanguage({
    languageCode,
  }: {
    languageCode: LanguageCode;
  }): Promise<VocaAggregate[]> {
    return this.vocaCoreRepository.findByLanguage({ languageCode });
  }

  async save({ voca }: { voca: VocaAggregate }): Promise<void> {
    for (const languageCode of voca.getSupportedLanguageCodes()) {
      const entity = voca.getLanguageDetail(languageCode);
      const repo = this.entityRepositories.get(languageCode);

      if (repo) {
        await repo.save(entity);
      }
    }
  }

  async delete({ id }: { id: number }): Promise<void> {
    // 모든 언어에서 엔티티 삭제
    const deletePromises = Array.from(this.entityRepositories.entries()).map(
      ([, repo]) => {
        return repo.repository.delete(id);
      },
    );
    await Promise.all(deletePromises);
  }
}
