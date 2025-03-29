import { BaseEntity } from '@/common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseVocaEntity } from './base-voca.entity';

@Entity('voca_core')
export class VocaCoreEntity extends BaseEntity {
  @Column()
  coreWord: string;

  @OneToMany(() => BaseVocaEntity, (vocaEntity) => vocaEntity.vocaId)
  languageDetails: BaseVocaEntity[];
}
