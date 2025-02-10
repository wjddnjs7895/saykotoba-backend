import { IsNumber } from 'class-validator';

export class StartClassroomByOrderRequestDto {
  @IsNumber()
  lectureOrder: number;
  @IsNumber()
  lessonOrder: number;
  @IsNumber()
  classroomId: number;
}

export class StartClassroomByOrderServiceDto extends StartClassroomByOrderRequestDto {
  userId: number;
}

export class StartClassroomByOrderResponseDto {
  @IsNumber()
  conversationId: number;
  @IsNumber()
  lectureOrder: number;
  @IsNumber()
  lessonOrder: number;
}
