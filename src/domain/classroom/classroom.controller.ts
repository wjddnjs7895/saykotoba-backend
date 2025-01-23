import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { CreateClassroomRequestDto } from './dtos/create-classroom.dto';
import { User } from '@/common/decorators/user.decorator';
import { UserEntity } from '../user/entities/user.entity';

@Controller('classroom')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @Get(':classroomId')
  async getClassroom(@Param('classroomId') classroomId: number) {
    return this.classroomService.getClassroom(classroomId);
  }

  @Post('create')
  async createClassroom(
    @User() user: UserEntity,
    @Body() createClassroomDto: CreateClassroomRequestDto,
  ) {
    return this.classroomService.createClassroom({
      ...createClassroomDto,
      userId: user.id,
    });
  }
}
