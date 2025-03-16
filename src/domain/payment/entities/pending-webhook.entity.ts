import { StoreType } from '@/common/constants/user.constants';
import { BaseEntity } from '@/common/entities/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('pending_webhooks')
export class PendingWebhookEntity extends BaseEntity {
  @Column({ type: 'text', nullable: false })
  notification: string;

  @Column({ name: 'original_transaction_id', nullable: false })
  originalTransactionId: string;

  @Column({ name: 'processed_at', nullable: true })
  processedAt: Date;

  @Column({ name: 'is_processed', nullable: true, default: false })
  isProcessed: boolean;

  @Column({
    type: 'enum',
    enum: StoreType,
    nullable: true,
  })
  storeType: StoreType;
}
