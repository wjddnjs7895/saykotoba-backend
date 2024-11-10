import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { AuthProvider } from '../constants/user.constants';
import { SubscriptionEntity } from './subscription.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({
    unique: true,
    comment: 'User email address',
  })
  email: string;

  @Column({
    nullable: true,
    select: false,
    comment: 'Password for local authentication',
  })
  password: string;

  @Column({
    nullable: true,
    select: false,
    comment: 'Google OAuth ID',
  })
  googleId: string;

  @Column({
    nullable: true,
    select: false,
    comment: 'Apple OAuth ID',
  })
  appleId: string;

  @Column({
    comment: 'User name',
  })
  name: string;

  @Column({
    type: 'enum',
    enum: AuthProvider,
    default: AuthProvider.LOCAL,
    comment: 'Authentication provider type (LOCAL or GOOGLE)',
  })
  provider: AuthProvider;

  @OneToOne(() => SubscriptionEntity, (subscription) => subscription.user)
  subscription: SubscriptionEntity;
}
