import { VocaJpEntity } from '../entities/voca-jp.entity';

export interface VocaStrategy {
  findAll(): Promise<VocaJpEntity[]>;
  create(dto: any): Promise<VocaJpEntity>;
}
