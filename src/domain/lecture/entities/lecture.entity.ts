import { BaseEntity } from '@/common/entities/base.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { LessonEntity } from './lesson.entity';
import { TopicEntity } from './topic.entity';
import { Language } from '@/common/constants/app.constants';
import { ClassroomEntity } from '@/domain/classroom/entities/classroom.entity';

@Entity('lecture')
export class LectureEntity extends BaseEntity {
  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'thumbnail_url', nullable: true })
  thumbnailUrl: string;

  @Column({ name: 'difficulty_level_start', default: 0 })
  difficultyLevelStart: number;

  @Column({ name: 'difficulty_level_end', default: 0 })
  difficultyLevelEnd: number;

  @Column({ name: 'is_completed', default: false })
  isCompleted: boolean;

  @Column({ name: 'progress', default: 0 })
  progress: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: Language,
    default: Language.EN,
    comment: 'Lecture language',
  })
  language: Language;

  @OneToMany(() => LessonEntity, (lesson) => lesson.lecture)
  lessons: LessonEntity[];

  @ManyToOne(() => TopicEntity, (topic) => topic.lectures)
  topic: TopicEntity;

  @ManyToMany(() => ClassroomEntity, (classroom) => classroom.lectures)
  classrooms: ClassroomEntity[];
}
