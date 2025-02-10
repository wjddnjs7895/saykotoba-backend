import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { LectureService } from './lecture.service';
import { GetLectureInfoResponseDto } from './dtos/get-lecture-info.dto';
import { GetLecturesResponseDto } from './dtos/get-lectures.dto';
import { User } from '@/common/decorators/user.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { StartLectureResponseDto } from './dtos/start-lecture.dto';
import { GetLessonInfoResponseDto } from './dtos/get-lesson-info.dto';
import { Admin } from '@/common/decorators/admin.decorator';
import {
  CreateLectureRequestDto,
  CreateLecturesResponseDto,
} from './dtos/create-lectures.dto';
import { StartLessonResponseDto } from './dtos/start-lesson.dto';

@Controller('lecture')
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @Get()
  async getAllLectures(
    @User() user: UserEntity,
  ): Promise<GetLecturesResponseDto[]> {
    return this.lectureService.getAllLectures(user.language);
  }

  @Get(':id')
  async getLectureInfoById(
    @Param('id') id: number,
  ): Promise<GetLectureInfoResponseDto> {
    return this.lectureService.getLectureInfoById(id);
  }

  @Post('/start/:id')
  async startLecture(
    @Param('id') id: number,
    @User() user: UserEntity,
  ): Promise<StartLectureResponseDto> {
    return this.lectureService.startLecture({
      lectureId: id,
      userId: user.id,
    });
  }

  @Post('/start/lesson/:id')
  async startLesson(
    @Param('id') id: number,
    @User() user: UserEntity,
  ): Promise<StartLessonResponseDto> {
    return this.lectureService.startLesson({
      userId: user.id,
      lessonId: id,
    });
  }

  @Get('/lesson/:lessonId')
  async getLessonInfo(
    @Param('lessonId') lessonId: number,
  ): Promise<GetLessonInfoResponseDto> {
    return this.lectureService.getLessonInfo(lessonId);
  }

  @Get('/topic/:topic')
  async getLecturesByTopic(
    @Param('topic') topic: string,
  ): Promise<GetLecturesResponseDto[]> {
    return this.lectureService.getLecturesByTopic(topic);
  }

  @Admin()
  @Post('/create')
  async createLectures(
    @Body() createLectureDto: CreateLectureRequestDto[],
  ): Promise<CreateLecturesResponseDto> {
    return this.lectureService.createLectures(createLectureDto);
  }

  @Admin()
  @Delete(':id')
  async deleteLecture(@Param('id') id: number): Promise<void> {
    return this.lectureService.deleteLecture(id);
  }
}
