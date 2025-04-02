import { BaseVocaEntity } from './base-voca.entity';
import { Column, Entity } from 'typeorm';
import { DifficultyJp } from '../../domain/value-objects/difficulty-jp';

@Entity('voca_jp')
export class VocaJpEntity extends BaseVocaEntity {
  @Column({ nullable: true })
  reading: string;

  @Column({ nullable: true })
  example_reading: string;

  @Column(() => DifficultyJp)
  difficulty: DifficultyJp;
}
