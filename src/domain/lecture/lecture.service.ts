import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LectureEntity } from './entities/lecture.entity';
import { GetLectureInfoResponseDto } from './dtos/get-lecture-info.dto';
import { GetLecturesResponseDto } from './dtos/get-lectures.dto';
import { ConversationGroupService } from '../conversation/services/conversation-group.service';
import { ConversationService } from '../conversation/services/conversation.service';
import {
  StartLectureRequestDto,
  StartLectureResponseDto,
} from './dtos/start-lecture-dto';
import {
  LectureNotFoundException,
  LessonNotFoundException,
} from '@/common/exception/custom-exception/lecture.exception';
import { CustomBaseException } from '@/common/exception/custom.base.exception';
import { UnexpectedException } from '@/common/exception/custom-exception/unexpected.exception';
import { GetLessonInfoResponseDto } from './dtos/get-lesson-info.dto';
import { LessonEntity } from './entities/lesson.entity';
import {
  CONVERSATION_GROUP_TYPE,
  CONVERSATION_TYPE,
} from '@/common/constants/conversation.constants';
import {
  ConversationGroupSaveFailedException,
  ConversationSaveFailedException,
} from '@/common/exception/custom-exception/conversation.exception';
@Injectable()
export class LectureService {
  constructor(
    @InjectRepository(LectureEntity)
    private readonly lectureRepository: Repository<LectureEntity>,
    @InjectRepository(LessonEntity)
    private readonly lessonRepository: Repository<LessonEntity>,
    private readonly conversationGroupService: ConversationGroupService,
    private readonly conversationService: ConversationService,
  ) {}

  async getAllLectures(): Promise<GetLecturesResponseDto[]> {
    const lectures = await this.lectureRepository.find({
      order: {
        id: 'ASC',
      },
    });
    if (!lectures) {
      throw new LectureNotFoundException();
    }
    return lectures.map((lecture) => ({
      id: lecture.id,
      title: lecture.title,
      thumbnailUrl: lecture.thumbnailUrl,
      difficultyLevel: lecture.difficultyLevel,
      description: lecture.description,
    }));
  }

  async getLectureInfoById(id: number): Promise<GetLectureInfoResponseDto> {
    const lecture = await this.lectureRepository.findOne({
      where: { id },
      relations: ['lessons'],
    });
    if (!lecture) {
      throw new LectureNotFoundException();
    }
    return {
      id: lecture.id,
      title: lecture.title,
      thumbnailUrl: lecture.thumbnailUrl,
      description: lecture.description,
      difficultyLevel: lecture.difficultyLevel,
      isCompleted: lecture.isCompleted,
      progress: lecture.progress,
      lessons: lecture.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
      })),
    };
  }

  async getLessonInfo(lessonId: number): Promise<GetLessonInfoResponseDto> {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
    });
    if (!lesson) {
      throw new LessonNotFoundException();
    }
    return {
      id: lesson.id,
      title: lesson.title,
      situation: lesson.situation,
      aiRole: lesson.aiRole,
      userRole: lesson.userRole,
      missions: lesson.missions.map((mission) => ({
        id: mission.id,
        mission: mission.mission,
      })),
      difficultyLevel: lesson.difficultyLevel,
    };
  }

  async startLecture(
    startLectureRequestDto: StartLectureRequestDto,
  ): Promise<StartLectureResponseDto> {
    try {
      const lecture = await this.lectureRepository.findOne({
        where: { id: startLectureRequestDto.lectureId },
        relations: ['lessons'],
      });

      if (!lecture) {
        throw new LectureNotFoundException();
      }

      const newConversationGroup =
        await this.conversationGroupService.createConversationGroup({
          userId: startLectureRequestDto.userId,
          name: lecture.title,
          description: lecture.description,
          thumbnailUrl: lecture.thumbnailUrl,
          difficultyLevel: lecture.difficultyLevel,
          type: CONVERSATION_GROUP_TYPE.LECTURE,
          conversationIds: [],
        });

      if (!newConversationGroup) {
        throw new ConversationGroupSaveFailedException();
      }

      const newConversations = await Promise.all(
        lecture.lessons.map((lesson) =>
          this.conversationService.createConversation({
            userId: startLectureRequestDto.userId,
            title: lecture.title,
            difficultyLevel: lesson.difficultyLevel,
            situation: lesson.situation,
            aiRole: lesson.aiRole,
            userRole: lesson.userRole,
            missions: lesson.missions.map((mission) => mission.mission),
            type: CONVERSATION_TYPE.LECTURE,
            problemId: lesson.id,
            thumbnailUrl: lecture.thumbnailUrl,
          }),
        ),
      );

      if (!newConversations) {
        throw new ConversationSaveFailedException();
      }

      await Promise.all(
        newConversations.map((conversation) =>
          this.conversationService.updateConversationGroup(
            conversation.conversationId,
            newConversationGroup.groupId,
          ),
        ),
      );

      return {
        conversationId: newConversations[0].conversationId,
        conversationGroupId: newConversationGroup.groupId,
      };
    } catch (error) {
      if (error instanceof CustomBaseException) {
        throw error;
      }
      throw new UnexpectedException();
    }
  }
}
