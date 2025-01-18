import { TypeOrmModule } from '@nestjs/typeorm';
import { LectureService } from './lecture.service';
import { Module } from '@nestjs/common';
import { LectureEntity } from './entities/lecture.entity';
import { LectureController } from './lecture.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LectureEntity])],
  exports: [LectureService],
  providers: [LectureService],
  controllers: [LectureController],
})
export class LectureModule {}
