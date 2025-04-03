import { FindOptionsWhere, Repository } from 'typeorm';
import { BaseEntity } from './base.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import {
  DeleteFailedException,
  EntityNotFoundException,
  SaveFailedException,
  UpdateFailedException,
} from '../exception/custom-exception/repository.exception';
import { CustomBaseException } from '../exception/custom.base.exception';

export class BaseRepository<T extends BaseEntity> {
  constructor(private readonly repository: Repository<T>) {}

  async findById({ id }: { id: number }): Promise<T | null> {
    try {
      return this.repository.findOne({
        where: { id: id } as FindOptionsWhere<T>,
      });
    } catch {
      throw new EntityNotFoundException();
    }
  }

  async findAll(): Promise<T[]> {
    try {
      return this.repository.find();
    } catch {
      throw new EntityNotFoundException();
    }
  }

  async save({ entity }: { entity: T }): Promise<T> {
    try {
      return this.repository.save(entity);
    } catch {
      throw new SaveFailedException();
    }
  }

  async delete({ id }: { id: number }): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch {
      throw new DeleteFailedException();
    }
  }

  async update({ id, entity }: { id: number; entity: Partial<T> }): Promise<T> {
    try {
      await this.repository.update(id, entity as QueryDeepPartialEntity<T>);
      const updated = await this.findById({ id });
      if (!updated) {
        throw new EntityNotFoundException();
      }
      return updated;
    } catch (error) {
      if (error instanceof CustomBaseException) {
        throw error;
      }
      throw new UpdateFailedException();
    }
  }
}
