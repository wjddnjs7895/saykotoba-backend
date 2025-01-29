import { BaseEntity } from '@/common/entities/base.entity';
import { LectureEntity } from '@/domain/lecture/entities/lecture.entity';
import { UserEntity } from '@/domain/user/entities/user.entity';
import { Entity, ManyToMany, ManyToOne, JoinTable, Column } from 'typeorm';

@Entity({ name: 'classroom' })
export class ClassroomEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.classrooms)
  user: UserEntity;

  @ManyToMany(() => LectureEntity, (lecture) => lecture.classrooms)
  @JoinTable({
    name: 'classroom_lecture',
    joinColumn: {
      name: 'classroom_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'lecture_id',
      referencedColumnName: 'id',
    },
  })
  lectures: LectureEntity[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
