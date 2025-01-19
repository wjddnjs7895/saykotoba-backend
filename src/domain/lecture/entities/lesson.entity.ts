import { BaseEntity } from '@/common/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { LectureEntity } from './lecture.entity';

@Entity('lesson')
export class LessonEntity extends BaseEntity {
  @Column({ name: 'title', default: 'Lesson' })
  title: string;

  @Column({ name: 'ai_role', default: 'language study assistant' })
  aiRole: string;

  @Column({ name: 'user_role', default: 'language learner' })
  userRole: string;

  @Column({ name: 'difficulty_level', default: 1 })
  difficultyLevel: number;

  @Column({ name: 'situation', default: '' })
  situation: string;

  @Column({ name: 'restriction', default: '' })
  restriction: string;

  @Column({ name: 'missions', type: 'json', default: [] })
  missions: {
    id: number;
    mission: string;
  }[];

  @ManyToOne(() => LectureEntity, (lecture) => lecture.lessons)
  lecture: LectureEntity;
}
