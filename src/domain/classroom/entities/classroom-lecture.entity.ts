import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { ClassroomEntity } from './classroom.entity';
import { LectureEntity } from '@/domain/lecture/entities/lecture.entity';
import { BaseEntity } from '@/common/base/base.entity';

@Entity('classroom_lecture')
export class ClassroomLectureEntity extends BaseEntity {
  @PrimaryColumn()
  classroomId: number;

  @PrimaryColumn()
  lectureId: number;

  @Column({ nullable: true })
  order: number;

  @ManyToOne(() => ClassroomEntity, (classroom) => classroom.classroomLectures)
  classroom: ClassroomEntity;

  @ManyToOne(() => LectureEntity, (lecture) => lecture.classroomLectures)
  lecture: LectureEntity;
}
