import { Injectable } from '@nestjs/common';
import { BaseVocaRepository } from './base-voca.repository';
import { VocaEnEntity } from '../entities/voca-en.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IVocaStrategy } from '../../domain/interfaces/voca-repository-strategy.interface';
import { DifficultyEn } from '../../domain/value-objects/difficulty-en';
import { VocaEn } from '../../domain/models/voca-en.model';

@Injectable()
export class VocaEnRepository
  extends BaseVocaRepository<VocaEnEntity>
  implements IVocaStrategy
{
  constructor(
    @InjectRepository(VocaEnEntity)
    repository: Repository<VocaEnEntity>,
  ) {
    super({ repository });
  }

  async findByDifficulty({
    difficulty,
  }: {
    difficulty: DifficultyEn;
  }): Promise<VocaEn[]> {
    return this.repository.find({
      where: { difficulty },
    });
  }
}
