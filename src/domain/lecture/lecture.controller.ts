import { Controller, Get, Param, Post } from '@nestjs/common';
import { LectureService } from './lecture.service';
import { GetLectureInfoResponseDto } from './dtos/get-lecture-info.dto';
import { GetLecturesResponseDto } from './dtos/get-lectures.dto';
import { User } from '@/common/decorators/user.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { StartLectureResponseDto } from './dtos/start-lecture-dto';
import { GetLessonInfoResponseDto } from './dtos/get-lesson-info.dto';

@Controller('lecture')
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @Get()
  async getAllLectures(): Promise<GetLecturesResponseDto[]> {
    return this.lectureService.getAllLectures();
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

  @Get('/lesson/:lessonId')
  async getLessonInfo(
    @Param('lessonId') lessonId: number,
  ): Promise<GetLessonInfoResponseDto> {
    return this.lectureService.getLessonInfo(lessonId);
  }
}
