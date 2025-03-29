import { BaseVocaEntity } from './base-voca.entity';
import { Column, Entity } from 'typeorm';
import { DifficultyEn } from '../value-objects/difficulty-en';

@Entity('voca_en')
export class VocaEnEntity extends BaseVocaEntity {
  @Column({ nullable: true })
  reading: string;

  @Column({ nullable: true })
  example_reading: string;

  @Column(() => DifficultyEn)
  difficulty: DifficultyEn;
}
