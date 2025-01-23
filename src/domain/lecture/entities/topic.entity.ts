import { BaseEntity } from '@/common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { LectureEntity } from './lecture.entity';
import { Language } from '@/common/constants/app.constants';

@Entity({ name: 'topic' })
export class TopicEntity extends BaseEntity {
  @Column({ name: 'name', default: '' })
  name: string;

  @OneToMany(() => LectureEntity, (lecture) => lecture.topic)
  lectures: LectureEntity[];

  @Column({
    type: 'enum',
    enum: Language,
    default: Language.EN,
    comment: 'Topic language',
  })
  language: Language;
}
