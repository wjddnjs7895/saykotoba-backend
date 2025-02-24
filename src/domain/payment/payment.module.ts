import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionEntity } from './entities/subscription.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { CustomLogger } from '@/common/logger/custom.logger';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionEntity])],
  providers: [PaymentService, CustomLogger],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
