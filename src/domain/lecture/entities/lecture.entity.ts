import { BaseEntity } from '@/common/entities/base.entity';
import { Column, Entity, OneToMany, UpdateDateColumn } from 'typeorm';
import { LessonEntity } from './lesson.entity';

@Entity('lecture')
export class LectureEntity extends BaseEntity {
  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'thumbnail_url', nullable: true })
  thumbnailUrl: string;

  @Column({ name: 'difficulty_level', default: 1 })
  difficultyLevel: number;

  @Column({ name: 'is_completed', default: false })
  isCompleted: boolean;

  @Column({ name: 'progress', default: 0 })
  progress: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => LessonEntity, (lesson) => lesson.lecture)
  lessons: LessonEntity[];
}
