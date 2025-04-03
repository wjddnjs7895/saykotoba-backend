import { BaseEntity } from '@/common/base/base.entity';
import { UserEntity } from '@/domain/user/entities/user.entity';
import { Entity, ManyToOne, OneToMany, Column } from 'typeorm';
import { ClassroomLectureEntity } from './classroom-lecture.entity';

@Entity({ name: 'classroom' })
export class ClassroomEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.classrooms)
  user: UserEntity;

  @OneToMany(
    () => ClassroomLectureEntity,
    (classroomLecture) => classroomLecture.classroom,
  )
  classroomLectures: ClassroomLectureEntity[];

  @Column({ type: 'integer', default: 0 })
  recentLectureOrder: number;

  @Column({ type: 'integer', default: 0 })
  recentLessonOrder: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
