import { forwardRef, Module } from '@nestjs/common';
import { ConversationService } from './services/conversation.service';
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
import { ConversationGroupService } from './services/conversation-group.service';
import { ClassroomEntity } from '../classroom/entities/classroom.entity';
import { CharacterModule } from '../character/character.module';
import { ClassroomModule } from '../classroom/classroom.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConversationEntity,
      MessageEntity,
      MissionEntity,
      FeedbackEntity,
      ConversationGroupEntity,
      ClassroomEntity,
    ]),
    forwardRef(() => UserModule),
    OpenAIModule,
    AwsModule,
    GoogleModule,
    CharacterModule,
    forwardRef(() => ClassroomModule),
  ],
  providers: [ConversationService, ConversationGroupService],
  controllers: [ConversationController],
  exports: [ConversationService, ConversationGroupService],
})
export class ConversationModule {}
