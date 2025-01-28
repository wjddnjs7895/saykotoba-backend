import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassroomController } from './classroom.controller';
import { ClassroomEntity } from './entities/classroom.entity';
import { ClassroomService } from './classroom.service';
import { UserModule } from '../user/user.module';
import { ConversationGroupEntity } from '../conversation/entities/conversation_group.entity';
import { LectureModule } from '../lecture/lecture.module';
import { OpenAIModule } from '@/integrations/openai/openai.module';
import { ConversationModule } from '../conversation/conversation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClassroomEntity, ConversationGroupEntity]),
    OpenAIModule,
    forwardRef(() => UserModule),
    forwardRef(() => LectureModule),
    forwardRef(() => ConversationModule),
  ],
  controllers: [ClassroomController],
  providers: [ClassroomService],
  exports: [ClassroomService],
})
export class ClassroomModule {}
