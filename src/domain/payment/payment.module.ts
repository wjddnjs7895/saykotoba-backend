import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionEntity } from './entities/subscription.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PendingWebhookEntity } from './entities/pending-webhook.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionEntity, PendingWebhookEntity]),
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
