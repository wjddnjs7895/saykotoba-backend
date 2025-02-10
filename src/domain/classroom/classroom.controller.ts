import { Body, Controller, Get, Post } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { CreateClassroomRequestDto } from './dtos/create-classroom.dto';
import { User } from '@/common/decorators/user.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { GetClassroomResponseDto } from './dtos/get-classroom.dto';
import { StartClassroomByOrderRequestDto } from './dtos/start-classroom-by-order.dto';

@Controller('classroom')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @Get('current')
  async getCurrentClassroom(
    @User() user: UserEntity,
  ): Promise<GetClassroomResponseDto> {
    return this.classroomService.getCurrentClassroom({ userId: user.id });
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

  @Post('start')
  async startClassroomByOrder(
    @User() user: UserEntity,
    @Body() startClassroomByOrderDto: StartClassroomByOrderRequestDto,
  ) {
    return this.classroomService.startClassroomByOrder({
      userId: user.id,
      ...startClassroomByOrderDto,
    });
  }
}
