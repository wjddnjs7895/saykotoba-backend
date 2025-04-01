import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { VocaCoreEntity } from '../entities/voca-core.entity';

@Injectable()
export class VocaCoreRepository {
  constructor(
    @InjectRepository(VocaCoreEntity)
    private readonly repository: Repository<VocaCoreEntity>,
  ) {}

  async findById({ id }: { id: number }): Promise<VocaCoreEntity> {
    return this.repository.findOne({
      where: { id },
    });
  }
}
