import { Controller, Get, Param } from '@nestjs/common';
import { ClassroomService } from './classroom.service';

@Controller('classroom')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @Get(':classroomId')
  async getClassroom(@Param('classroomId') classroomId: number) {
    return this.classroomService.getClassroom(classroomId);
  }
}
