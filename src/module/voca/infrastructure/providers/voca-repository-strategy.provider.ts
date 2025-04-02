import { Injectable } from '@nestjs/common';
import { VocaJpRepository } from '../repositories/voca-jp.repository';
import { VocaEnRepository } from '../repositories/voca-en.repository';
import { IVocaRepositoryStrategy } from '../../domain/interfaces/voca-repository-strategy.interface';
import { RepositoryNotFoundException } from '@/common/exception/custom-exception/repository.exception';

@Injectable()
export class VocaRepositoryStrategyProvider {
  private strategyMap: Map<string, IVocaRepositoryStrategy>;

  constructor(
    private readonly vocaJpRepository: VocaJpRepository,
    private readonly vocaEnRepository: VocaEnRepository,
  ) {
    this.strategyMap = new Map();
    this.strategyMap.set('jp', this.vocaJpRepository);
    this.strategyMap.set('en', this.vocaEnRepository);
  }

  getStrategy(languageCode: string): IVocaRepositoryStrategy {
    const strategy = this.strategyMap.get(languageCode);
    if (!strategy) {
      throw new RepositoryNotFoundException();
    }
    return strategy;
  }
}
