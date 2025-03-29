// src/modules/voca/infrastructure/repositories/voca-jp.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseVocaRepository } from './base-voca.repository';
import { VocaJpEntity } from '../../domain/entities/voca-jp.entity';

@Injectable()
export class VocaJpRepository extends BaseVocaRepository<VocaJpEntity> {
  constructor(
    @InjectRepository(VocaJpEntity)
    repository: Repository<VocaJpEntity>,
  ) {
    super(repository);
  }

  // 일본어 전용 기능
}
