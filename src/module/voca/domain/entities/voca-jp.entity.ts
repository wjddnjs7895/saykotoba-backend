import { BaseVocaEntity } from './base-voca.entity';
import { Column, Entity } from 'typeorm';
import { DifficultyJp } from '../value-objects/difficulty-jp';

@Entity('voca_jp')
export class VocaJpEntity extends BaseVocaEntity {
  @Column()
  reading: string;

  @Column()
  example_reading: string;

  @Column(() => DifficultyJp)
  difficulty: DifficultyJp;

  getFormattedInfo(): string {
    return `JP: ${this.reading} - ${this.meaning} (Example: ${this.example})`;
  }

  convertKanaToRomaji(): string {
    return `Romaji(${this.reading})`;
  }
}
