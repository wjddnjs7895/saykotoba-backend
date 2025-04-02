import { BaseVocaEntity } from '../../infrastructure/entities/base-voca.entity';
import { IVocaMapperStrategy } from '../interfaces/voca-mapper-strategy.interface';
import { BaseVoca } from '../models/base-voca.model';

export class VocaModelMapper {
  static toModel<TModel extends BaseVoca, TEntity extends BaseVocaEntity>(
    entity: TEntity,
    strategy: IVocaMapperStrategy<TModel, TEntity>,
  ): TModel {
    return strategy.toModel({ voca: entity });
  }

  static toEntity<TModel extends BaseVoca, TEntity extends BaseVocaEntity>(
    model: TModel,
    strategy: IVocaMapperStrategy<TModel, TEntity>,
  ): TEntity {
    return strategy.toEntity({ voca: model });
  }
}
