import { Injectable } from '@nestjs/common';
import { IVocaRepository } from '../../domain/repositories/base-voca.interface';
import { VocaAggregate } from '../../domain/aggregates/voca.aggregate';
import { LanguageCode } from '@/common/enums/language-code.enum';
import { VocaJpRepository } from './voca-jp.repository';
import { VocaCoreRepository } from './voca-core.repository';

@Injectable()
export class VocaRepositoryImpl implements IVocaRepository {
  private entityRepositories: Map<LanguageCode, any>;

  constructor(
    private readonly vocaCoreRepository: VocaCoreRepository,
    private readonly vocaJpRepository: VocaJpRepository,
  ) {
    this.entityRepositories = new Map();
    this.entityRepositories.set(LanguageCode.JP, vocaJpRepository);
  }

  async findById(id: number): Promise<VocaAggregate> {
    // 데이터베이스에서 VocaEntity 조회
    const vocaEntity = await this.vocaCoreRepository.findById({ id });

    if (!vocaEntity) return null;

    // VocaAggregate 생성
    const vocaAggregate = new VocaAggregate(vocaEntity.id, vocaEntity.coreWord);

    // 각 언어별 엔티티 추가
    vocaEntity.languageDetails.forEach((detail) => {
      vocaAggregate.addLanguageDetail(detail);
    });

    return vocaAggregate;
  }

  async save(voca: VocaAggregate): Promise<void> {
    for (const languageCode of voca.getSupportedLanguageCodes()) {
      const entity = voca.getLanguageDetail(languageCode);
      const repo = this.entityRepositories.get(languageCode);

      if (repo) {
        await repo.save(entity);
      }
    }
  }

  async delete(id: string): Promise<void> {
    // 모든 언어에서 엔티티 삭제
    const deletePromises = Array.from(this.entityRepositories.entries()).map(
      ([, repo]) => {
        const numericId = parseInt(id);
        return repo.repository.delete(numericId);
      },
    );
    await Promise.all(deletePromises);
  }
}
