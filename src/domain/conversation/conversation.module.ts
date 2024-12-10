import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationEntity } from './entities/conversation.entity';
import { MessageEntity } from './entities/message.entity';
import { OpenAIService } from '../../integrations/openai/openai.service';
import { MissionEntity } from './entities/mission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConversationEntity,
      MessageEntity,
      MissionEntity,
    ]),
  ],
  providers: [ConversationService, OpenAIService],
  controllers: [ConversationController],
})
export class ConversationModule {}
