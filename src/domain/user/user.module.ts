import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { SubscriptionEntity } from '../payment/entities/subscription.entity';
import { ConversationGroupEntity } from '../conversation/entities/conversation_group.entity';
import { ClassroomEntity } from '../classroom/entities/classroom.entity';
import { InterestEntity } from './entities/interest.entity';
import { OnboardingService } from './services/onboarding.service';
import { ClassroomModule } from '../classroom/classroom.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      SubscriptionEntity,
      ConversationGroupEntity,
      ClassroomEntity,
      InterestEntity,
      PaymentModule,
    ]),
    forwardRef(() => ClassroomModule),
  ],
  controllers: [UserController],
  providers: [UserService, OnboardingService],
  exports: [UserService, OnboardingService],
})
export class UserModule {}
