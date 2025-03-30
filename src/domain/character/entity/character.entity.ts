import { CHARACTER_GENDER } from '@/common/constants/character.constants';
import { BaseEntity } from '@/common/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('character')
export class CharacterEntity extends BaseEntity {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'age', default: 20 })
  age: number;

  @Column({
    name: 'gender',
    default: CHARACTER_GENDER.MALE,
    type: 'enum',
    enum: CHARACTER_GENDER,
  })
  gender: CHARACTER_GENDER;

  @Column({ name: 'job', default: '' })
  job: string;

  @Column({ name: 'personality', default: '' })
  personality: string;

  @Column({ name: 'characteristics', default: [], type: 'json' })
  characteristics: string[];

  @Column({ name: 'image_url', default: '' })
  imageUrl: string;

  @Column({ name: 'description', default: '' })
  description: string;
}
