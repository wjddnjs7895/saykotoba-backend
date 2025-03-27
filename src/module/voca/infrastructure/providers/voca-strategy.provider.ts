import { VocaJpStrategy } from '../../module/voca/strategies/voca-jp.strategy';

export const VocaStrategyProvider = {
  provide: 'VOCA_STRATEGY_MAP',
  useFactory: (jp: VocaJpStrategy) => new Map([['jp', jp]]),
  inject: [VocaJpStrategy],
};
