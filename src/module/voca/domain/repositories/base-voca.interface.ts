import { VocaAggregate } from '../aggregates/voca.aggregate';

export interface IVocaRepository {
  findById(id: number): Promise<VocaAggregate | null>;
  save(voca: VocaAggregate): Promise<void>;
}
