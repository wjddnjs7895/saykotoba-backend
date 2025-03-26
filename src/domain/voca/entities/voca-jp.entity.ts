import { BaseEntity } from '@/common/entities/base.entity';
import { Column, Entity } from 'typeorm';
import { DifficultyJp } from '../value-objects/difficulty-jp';

@Entity('voca_jp')
export class VocaJpEntity extends BaseEntity {
  @Column()
  word: string;

  @Column()
  meaning: string;

  @Column()
  reading: string;

  @Column()
  example: string;

  @Column()
  example_meaning: string;

  @Column()
  example_reading: string;

  @Column(() => DifficultyJp)
  difficulty: DifficultyJp;
}
