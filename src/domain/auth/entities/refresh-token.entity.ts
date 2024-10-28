import { BaseEntity } from 'src/common/entities/base.entity';
import { UserEntity } from 'src/domain/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class RefreshToken extends BaseEntity {
  @Column()
  token: string;

  @Column()
  userId: number;

  @Column()
  expiresAt: Date;

  @Column()
  isRevoked: boolean;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (userId) => userId.id)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
