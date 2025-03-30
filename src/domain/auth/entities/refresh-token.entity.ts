import { BaseEntity } from '@/common/base/base.entity';
import { UserEntity } from 'src/domain/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';

@Entity('refresh_token')
export class RefreshTokenEntity extends BaseEntity {
  @Column({ name: 'refresh_token' })
  refreshToken: string;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ name: 'is_revoked', default: false })
  isRevoked: boolean;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
