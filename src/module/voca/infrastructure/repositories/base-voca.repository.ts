import { Repository } from 'typeorm';
import { BaseVocaEntity } from '../../domain/entities/base-voca.entity';
import { FindOptionsWhere } from 'typeorm';

export abstract class BaseVocaRepository<T extends BaseVocaEntity> {
  protected readonly repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  async save(entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  async findById(id: string): Promise<T | null> {
    return this.repository.findOne({
      where: { id: parseInt(id) } as FindOptionsWhere<T>,
    });
  }
}
