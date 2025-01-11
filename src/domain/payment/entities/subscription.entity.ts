import { BaseEntity } from '@/common/entities/base.entity';
import {
  StoreType,
  SubscriptionStatus,
} from '@/domain/user/constants/user.constants';
import { UserEntity } from '@/domain/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity('subscription')
export class SubscriptionEntity extends BaseEntity {
  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.NONE,
    comment: 'Current subscription status (NONE, ACTIVE, EXPIRED, etc.)',
  })
  status: SubscriptionStatus;

  @Column({
    nullable: true,
    comment:
      'Original transaction ID from first subscription purchase - remains constant',
  })
  originalTransactionId: string;

  @Column({
    nullable: true,
    comment: 'Latest transaction ID - updates with each renewal',
  })
  latestTransactionId: string;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'Date of the most recent successful payment',
  })
  lastPaidAt: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'Subscription expiration date',
  })
  expiresAt: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'Trial period end date',
  })
  trialEndsAt: Date;

  @Column({
    type: 'enum',
    enum: StoreType,
    nullable: true,
    comment: 'Store platform type (APP_STORE or GOOGLE_PLAY)',
  })
  storeType: StoreType;

  @Column({
    nullable: true,
    comment: 'Store-specific subscription product identifier',
  })
  productId: string;

  @Column({
    default: true,
    comment: 'Auto-renewal status flag',
  })
  isAutoRenew: boolean;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'Subscription cancellation date',
  })
  cancelledAt: Date;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;
}
