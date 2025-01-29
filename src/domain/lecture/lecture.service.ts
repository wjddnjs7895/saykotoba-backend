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
} from './dtos/start-lecture.dto';
import {
  LectureDeleteFailedException,
  LectureNotFoundException,
  LessonDeleteFailedException,
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
import { S3Service } from '@/integrations/aws/services/s3/s3.service';
import { Language } from '@/common/constants/app.constants';
import {
  CreateLectureRequestDto,
  CreateLecturesResponseDto,
} from './dtos/create-lectures.dto';
import { TopicEntity } from './entities/topic.entity';
import { In } from 'typeorm';
import {
  StartLessonRequestDto,
  StartLessonResponseDto,
} from './dtos/start-lesson.dto';

@Injectable()
export class LectureService {
  constructor(
    @InjectRepository(LectureEntity)
    private readonly lectureRepository: Repository<LectureEntity>,
    @InjectRepository(LessonEntity)
    private readonly lessonRepository: Repository<LessonEntity>,
    private readonly conversationGroupService: ConversationGroupService,
    private readonly conversationService: ConversationService,
    private readonly s3Service: S3Service,
    @InjectRepository(TopicEntity)
    private readonly topicRepository: Repository<TopicEntity>,
  ) {}

  async getAllLectures(language: Language): Promise<GetLecturesResponseDto[]> {
    const lectures = await this.lectureRepository.find({
      where: {
        language,
      },
      order: {
        id: 'ASC',
      },
      relations: ['topic', 'lessons'],
    });
    if (!lectures || lectures.length === 0) {
      throw new LectureNotFoundException();
    }
    return lectures.map((lecture) => ({
      id: lecture.id,
      title: lecture.title,
      thumbnailUrl: this.s3Service.getCloudFrontUrl(lecture.thumbnailUrl) ?? '',
      difficultyLevelStart: lecture.difficultyLevelStart,
      difficultyLevelEnd: lecture.difficultyLevelEnd,
      description: lecture.description,
      topic: lecture.topic?.name ?? '',
      lessonIds: lecture.lessons.map((lesson) => lesson.id),
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
      thumbnailUrl: this.s3Service.getCloudFrontUrl(lecture.thumbnailUrl) ?? '',
      description: lecture.description,
      difficultyLevelStart: lecture.difficultyLevelStart,
      difficultyLevelEnd: lecture.difficultyLevelEnd,
      isCompleted: lecture.isCompleted,
      progress: lecture.progress,
      lessons: lecture.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        difficultyLevel: lesson.difficultyLevel,
        thumbnailUrl: this.s3Service.getCloudFrontUrl(lesson.thumbnailUrl),
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
      exp: lesson.exp,
      thumbnailUrl: this.s3Service.getCloudFrontUrl(lesson.thumbnailUrl),
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
          thumbnailUrl: lecture.thumbnailUrl ?? '',
          difficultyLevelStart: lecture.difficultyLevelStart,
          difficultyLevelEnd: lecture.difficultyLevelEnd,
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
            characteristic: '',
            type: CONVERSATION_TYPE.LECTURE,
            problemId: lesson.id,
            thumbnailUrl: lecture.thumbnailUrl ?? '',
            exp: lesson.exp,
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

  async startLesson(
    startLessonRequestDto: StartLessonRequestDto,
  ): Promise<StartLessonResponseDto> {
    try {
      const lesson = await this.lessonRepository.findOne({
        where: { id: startLessonRequestDto.lessonId },
      });

      if (!lesson) {
        throw new LessonNotFoundException();
      }

      const newConversation = await this.conversationService.createConversation(
        {
          userId: startLessonRequestDto.userId,
          title: lesson.title,
          difficultyLevel: lesson.difficultyLevel,
          situation: lesson.situation,
          aiRole: lesson.aiRole,
          userRole: lesson.userRole,
          missions: lesson.missions.map((mission) => mission.mission),
          characteristic: '',
          type: CONVERSATION_TYPE.LECTURE,
          problemId: lesson.id,
          thumbnailUrl: lesson.thumbnailUrl,
          exp: lesson.exp,
        },
      );

      if (!newConversation) {
        throw new ConversationSaveFailedException();
      }
      return {
        conversationId: newConversation.conversationId,
      };
    } catch (error) {
      if (error instanceof CustomBaseException) {
        throw error;
      }
      throw new UnexpectedException();
    }
  }

  async getLecturesByTopic(topic: string): Promise<GetLecturesResponseDto[]> {
    const lectures = await this.lectureRepository.find({
      where: { topic: { name: topic } },
      order: {
        id: 'ASC',
      },
    });
    return lectures.map((lecture) => ({
      id: lecture.id,
      title: lecture.title,
      thumbnailUrl: this.s3Service.getCloudFrontUrl(lecture.thumbnailUrl) ?? '',
      difficultyLevelStart: lecture.difficultyLevelStart,
      difficultyLevelEnd: lecture.difficultyLevelEnd,
      description: lecture.description,
      topic: lecture.topic.name,
      lessonIds: lecture.lessons.map((lesson) => lesson.id),
    }));
  }

  async createLectures(
    createLectureDto: CreateLectureRequestDto[],
  ): Promise<CreateLecturesResponseDto> {
    const topicNames = [...new Set(createLectureDto.map((dto) => dto.topic))];

    const existingTopics = await this.topicRepository.find({
      where: { name: In(topicNames) },
    });

    const lectureEntities = await Promise.all(
      createLectureDto.map(async (dto) => {
        const existingTopic = existingTopics.find(
          (topic) => topic.name === dto.topic,
        );
        return {
          ...dto,
          topic: existingTopic || { name: dto.topic },
          lessons: await Promise.all(
            dto.lessons.map(async (lesson) => {
              const newLesson = this.lessonRepository.create({
                ...lesson,
                language: dto.language,
                missions: await Promise.all(
                  lesson.missions.map(async (mission) => ({
                    mission: mission,
                  })),
                ),
              });
              return await this.lessonRepository.save(newLesson);
            }),
          ),
        };
      }),
    );

    const lectures = await this.lectureRepository.save(lectureEntities);
    return { lectureIds: lectures.map((lecture) => lecture.id) };
  }

  async deleteLecture(lectureId: number): Promise<void> {
    try {
      await this.lectureRepository.delete(lectureId);
    } catch {
      throw new LectureDeleteFailedException();
    }
    try {
      await this.lessonRepository.delete({ lecture: { id: lectureId } });
    } catch {
      throw new LessonDeleteFailedException();
    }
  }
}
