import { TypeOrmModule } from '@nestjs/typeorm';
import { LectureService } from './lecture.service';
import { Module } from '@nestjs/common';
import { LectureEntity } from './entities/lecture.entity';
import { LectureController } from './lecture.controller';
import { LessonEntity } from './entities/lesson.entity';
import { ConversationModule } from '../conversation/conversation.module';
import { TopicEntity } from './entities/topic.entity';
import { AwsModule } from '@/integrations/aws/aws.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LectureEntity, LessonEntity, TopicEntity]),
    ConversationModule,
    AwsModule,
  ],
  exports: [LectureService],
  providers: [LectureService],
  controllers: [LectureController],
})
export class LectureModule {}
