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
import { AwsModule } from '@/integrations/aws/aws.module';
import { ClassroomLectureEntity } from './entities/classroom-lecture.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClassroomEntity,
      ConversationGroupEntity,
      ClassroomLectureEntity,
    ]),
    OpenAIModule,
    forwardRef(() => UserModule),
    forwardRef(() => LectureModule),
    forwardRef(() => ConversationModule),
    AwsModule,
  ],
  controllers: [ClassroomController],
  providers: [ClassroomService],
  exports: [ClassroomService],
})
export class ClassroomModule {}
