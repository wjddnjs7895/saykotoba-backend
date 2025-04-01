import { BaseVocaEntity } from '../../infrastructure/entities/base-voca.entity';
import { BaseVoca } from '../models/base-voca.model';

export interface IVocaMapperStrategy<
  TModel extends BaseVoca,
  TEntity extends BaseVocaEntity,
> {
  toEntity({ voca }: { voca: TModel }): TEntity;
  toModel({ voca }: { voca: TEntity }): TModel;
}
