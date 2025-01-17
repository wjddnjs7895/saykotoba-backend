import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { SubscriptionEntity } from '../payment/entities/subscription.entity';
import { ConversationGroupEntity } from '../conversation/entities/conversation_group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      SubscriptionEntity,
      ConversationGroupEntity,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
