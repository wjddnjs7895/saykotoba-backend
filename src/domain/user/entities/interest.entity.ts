import { BaseEntity } from '@/common/base/base.entity';
import { Column, Entity, ManyToMany } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('interest')
export class InterestEntity extends BaseEntity {
  @Column({ default: '' })
  shortName: string;

  @Column({ unique: true })
  interest: string;

  @ManyToMany(() => UserEntity, (user) => user.interests)
  users: UserEntity[];
}
