import { IsNumber } from 'class-validator';

export class StartLectureRequestDto {
  @IsNumber()
  lectureId: number;

  @IsNumber()
  userId: number;
}

export class StartLectureResponseDto {
  @IsNumber()
  conversationId: number;

  @IsNumber()
  conversationGroupId: number;
}
