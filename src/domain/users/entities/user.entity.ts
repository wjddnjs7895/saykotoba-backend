import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  userTypeId: number;

  @Column()
  password: string;
}
