// src/modules/voca/infrastructure/providers/voca-strategy.provider.ts
import { Provider } from '@nestjs/common';
import { IVocaMapperStrategy } from '../../domain/interfaces/voca-mapper-strategy.interface';
import { VocaJpMapperStrategy } from '../../domain/mappers/voca-jp.mapper.strategy';
import { VocaEnMapperStrategy } from '../../domain/mappers/voca-en.mapper.strategy';

export const VOCA_MAPPER_STRATEGY_MAP = 'VOCA_MAPPER_STRATEGY_MAP';

export const VocaMapperStrategyProvider: Provider = {
  provide: VOCA_MAPPER_STRATEGY_MAP,
  useFactory: (
    vocaJpMapperStrategy: VocaJpMapperStrategy,
    vocaEnMapperStrategy: VocaEnMapperStrategy,
  ): Map<string, IVocaMapperStrategy<any, any>> => {
    return new Map<string, IVocaMapperStrategy<any, any>>([
      ['jp', vocaJpMapperStrategy],
      ['en', vocaEnMapperStrategy],
    ]);
  },
  inject: [VocaJpMapperStrategy, VocaEnMapperStrategy],
};
