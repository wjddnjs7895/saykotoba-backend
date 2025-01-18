import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LectureEntity } from './entities/lecture.entity';
import { GetLectureInfoResponseDto } from './dtos/get-lecture-info.dto';
@Injectable()
export class LectureService {
  constructor(
    @InjectRepository(LectureEntity)
    private readonly lectureRepository: Repository<LectureEntity>,
  ) {}

  async getAllLectures() {
    return this.lectureRepository.find();
  }

  async getLectureInfoById(id: number): Promise<GetLectureInfoResponseDto> {
    const lecture = await this.lectureRepository.findOne({
      where: { id },
      relations: ['conversations'],
    });
    return {
      id: lecture.id,
      title: lecture.title,
      thumbnailUrl: lecture.thumbnailUrl,
      description: lecture.description,
      difficultyLevel: lecture.difficultyLevel,
      isCompleted: lecture.isCompleted,
      progress: lecture.progress,
      conversationIds: lecture.conversations.map(
        (conversation) => conversation.id,
      ),
    };
  }
}
