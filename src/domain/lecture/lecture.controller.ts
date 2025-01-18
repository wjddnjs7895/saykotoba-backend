import { Controller, Get, Param } from '@nestjs/common';
import { LectureService } from './lecture.service';
import { GetLectureInfoResponseDto } from './dtos/get-lecture-info.dto';

@Controller('lecture')
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @Get()
  async getAllLectures() {
    return this.lectureService.getAllLectures();
  }

  @Get(':id')
  async getLectureInfoById(
    @Param('id') id: number,
  ): Promise<GetLectureInfoResponseDto> {
    return this.lectureService.getLectureInfoById(id);
  }
}
