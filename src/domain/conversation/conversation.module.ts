import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationEntity } from './entities/conversation.entity';
import { MessageEntity } from './entities/message.entity';
import { MissionEntity } from './entities/mission.entity';
import { FeedbackEntity } from './entities/feedback.entity';
import { UserModule } from '../user/user.module';
import { OpenAIModule } from '@/integrations/openai/openai.module';
import { AwsModule } from '@/integrations/aws/aws.module';
import { GoogleModule } from '@/integrations/google/google.module';
import { ConversationGroupEntity } from './entities/conversation_group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConversationEntity,
      MessageEntity,
      MissionEntity,
      FeedbackEntity,
      ConversationGroupEntity,
    ]),
    UserModule,
    OpenAIModule,
    AwsModule,
    GoogleModule,
  ],
  providers: [ConversationService],
  controllers: [ConversationController],
})
export class ConversationModule {}
