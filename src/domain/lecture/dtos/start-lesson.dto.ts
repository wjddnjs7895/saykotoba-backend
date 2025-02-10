import { IsNumber } from 'class-validator';

export class StartLessonRequestDto {
  @IsNumber()
  userId: number;
  @IsNumber()
  lessonId: number;
}

export class StartLessonResponseDto {
  @IsNumber()
  conversationId: number;
}
