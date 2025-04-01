// src/modules/voca/infrastructure/repositories/voca-jp.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseVocaRepository } from './base-voca.repository';
import { VocaJpEntity } from '../entities/voca-jp.entity';
import { IVocaRepositoryStrategy } from '../../domain/interfaces/voca-repository-strategy.interface';
import { DifficultyJp } from '../../domain/value-objects/difficulty-jp';
import { VocaJp } from '../../domain/models/voca-jp.model';
import { VocaModelMapper } from '../../domain/mappers/voca-model.mapper';
import { VocaMapperStrategyProvider } from '../providers/voca-mapper-strategy.provider';

@Injectable()
export class VocaJpRepository
  extends BaseVocaRepository<VocaJpEntity>
  implements IVocaRepositoryStrategy
{
  constructor(
    @InjectRepository(VocaJpEntity)
    repository: Repository<VocaJpEntity>,
    private readonly vocaMapperStrategyProvider: VocaMapperStrategyProvider,
  ) {
    super({ repository });
  }

  async findByDifficulty({
    difficulty,
  }: {
    difficulty: DifficultyJp;
  }): Promise<VocaJp[]> {
    const entities = await this.repository.find({ where: { difficulty } });
    return entities.map((entity) =>
      VocaModelMapper.toModel({ entity, languageCode: 'jp' }),
    );
  }

  // 일본어 전용 기능
}
