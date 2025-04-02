import { Repository } from 'typeorm';
import { BaseVocaEntity } from '../entities/base-voca.entity';
import { FindOptionsWhere } from 'typeorm';

export abstract class BaseVocaRepository<T extends BaseVocaEntity> {
  protected readonly repository: Repository<T>;

  constructor({ repository }: { repository: Repository<T> }) {
    this.repository = repository;
  }

  async save({ entity }: { entity: T }): Promise<T> {
    return this.repository.save(entity);
  }

  async findById({ id }: { id: number }): Promise<T | null> {
    return this.repository.findOne({
      where: { id: id } as FindOptionsWhere<T>,
    });
  }
}
