import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassroomController } from './classroom.controller';
import { ClassroomEntity } from './entities/classroom.entity';
import { ClassroomService } from './classroom.service';
import { UserModule } from '../user/user.module';
import { ConversationGroupEntity } from '../conversation/entities/conversation_group.entity';
import { LectureModule } from '../lecture/lecture.module';
import { OpenAIModule } from '@/integrations/openai/openai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClassroomEntity, ConversationGroupEntity]),
    UserModule,
    LectureModule,
    OpenAIModule,
  ],
  controllers: [ClassroomController],
  exports: [ClassroomService],
  providers: [ClassroomService],
})
export class ClassroomModule {}
