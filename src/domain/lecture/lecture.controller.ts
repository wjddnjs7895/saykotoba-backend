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
import { LogParams } from '@/common/decorators/log-params.decorator';

@Controller('lecture')
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @Get()
  @LogParams()
  async getAllLectures(
    @User() user: UserEntity,
  ): Promise<GetLecturesResponseDto[]> {
    return this.lectureService.getAllLectures(user.language);
  }

  @Get(':id')
  @LogParams()
  async getLectureInfoById(
    @Param('id') id: number,
  ): Promise<GetLectureInfoResponseDto> {
    return this.lectureService.getLectureInfoById(id);
  }

  @Post('/start/:id')
  @LogParams()
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
  @LogParams()
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
  @LogParams()
  async getLessonInfo(
    @Param('lessonId') lessonId: number,
  ): Promise<GetLessonInfoResponseDto> {
    return this.lectureService.getLessonInfo(lessonId);
  }

  @Get('/topic/:topic')
  @LogParams()
  async getLecturesByTopic(
    @Param('topic') topic: string,
  ): Promise<GetLecturesResponseDto[]> {
    return this.lectureService.getLecturesByTopic(topic);
  }

  @Admin()
  @Post('/create')
  @LogParams()
  async createLectures(
    @Body() createLectureDto: CreateLectureRequestDto[],
  ): Promise<CreateLecturesResponseDto> {
    return this.lectureService.createLectures(createLectureDto);
  }

  @Admin()
  @Delete(':id')
  @LogParams()
  async deleteLecture(@Param('id') id: number): Promise<void> {
    return this.lectureService.deleteLecture(id);
  }
}
