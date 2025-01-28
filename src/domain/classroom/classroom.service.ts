import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ClassroomEntity } from './entities/classroom.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ClassroomNotFoundException,
  ClassroomSaveFailedException,
} from '@/common/exception/custom-exception/classroom.exception';
import { GetClassroomResponseDto } from './dtos/get-classroom.dto';
import { UserService } from '../user/services/user.service';
import { CreateClassroomServiceDto } from './dtos/create-classroom.dto';
import { LectureService } from '../lecture/lecture.service';
import { ConversationGroupService } from '../conversation/services/conversation-group.service';
import { CONVERSATION_GROUP_TYPE } from '@/common/constants/conversation.constants';
import { OpenAIService } from '@/integrations/openai/openai.service';
import { CustomBaseException } from '@/common/exception/custom.base.exception';
import { UnexpectedException } from '@/common/exception/custom-exception/unexpected.exception';
import { CLASSROOM_STYLE } from '@/common/constants/classroom.constants';
import { OnboardingService } from '../user/services/onboarding.service';

@Injectable()
export class ClassroomService {
  constructor(
    @InjectRepository(ClassroomEntity)
    private readonly classroomRepository: Repository<ClassroomEntity>,
    private readonly userService: UserService,
    private readonly lectureService: LectureService,
    private readonly conversationGroupService: ConversationGroupService,
    private readonly openaiService: OpenAIService,
    @Inject(forwardRef(() => OnboardingService))
    private readonly onboardingService: OnboardingService,
  ) {}

  async getClassroom(classroomId: number): Promise<GetClassroomResponseDto> {
    const classroom = await this.classroomRepository.findOne({
      where: { id: classroomId },
      relations: [
        'user',
        'conversationGroups',
        'conversationGroups.conversations',
      ],
    });

    if (!classroom) {
      throw new ClassroomNotFoundException();
    }

    const result = new GetClassroomResponseDto();
    result.conversationGroups = await Promise.all(
      classroom.conversationGroups.map(async (group) => ({
        id: group.id,
        name: group.name,
        description: group.description,
        thumbnailUrl: group.thumbnailUrl,
        difficultyLevelStart: group.difficultyLevelStart,
        difficultyLevelEnd: group.difficultyLevelEnd,
        updatedAt: group.updatedAt,
        conversations: await Promise.all(
          group.conversations.map(async (conversation) => ({
            id: conversation.id,
            title: conversation.title,
            situation: conversation.situation,
            difficultyLevel: conversation.difficultyLevel,
            isCompleted: await this.userService.isSolvedConversation({
              userId: classroom.user.id,
              problemId: conversation.problemId,
            }),
          })),
        ),
        isCompleted: false,
      })),
    );

    result.conversationGroups = result.conversationGroups.map((group) => ({
      ...group,
      isCompleted: group.conversations.every((conv) => conv.isCompleted),
    }));

    return result;
  }

  async createClassroom(createClassroomDto: CreateClassroomServiceDto) {
    console.log(createClassroomDto);
    try {
      const lectures = await this.lectureService.getAllLectures(
        createClassroomDto.language,
      );

      const interests = await this.onboardingService.getInterestList();

      const aiSelectResult = await this.openaiService.generateClassroom({
        language: createClassroomDto.language,
        style: CLASSROOM_STYLE[createClassroomDto.style],
        interests: interests.interests
          .filter((interest) =>
            createClassroomDto.interestIds.includes(interest.id),
          )
          .map((interest) => interest.interest),
        requiredStatement: createClassroomDto.requiredStatement,
        difficultyLevel: createClassroomDto.difficultyLevel,
        lectures: await Promise.all(
          lectures.map(async (lecture) => ({
            id: lecture.id,
            title: lecture.title,
            description: lecture.description,
            thumbnailUrl: lecture.thumbnailUrl,
            difficultyLevelStart: lecture.difficultyLevelStart,
            difficultyLevelEnd: lecture.difficultyLevelEnd,
            lessons: await Promise.all(
              lecture.lessonIds.map(async (lessonId) =>
                this.lectureService.getLessonInfo(lessonId),
              ),
            ),
          })),
        ),
      });

      const validLectureIds = aiSelectResult.lectureIds.filter((lectureId) =>
        lectures.some((l) => l.id === lectureId),
      );
      console.log(aiSelectResult);
      console.log(validLectureIds);
      const conversationGroups = await Promise.all(
        validLectureIds.map(async (lectureId) => {
          const lecture = lectures.find((l) => l.id === lectureId);
          return await this.conversationGroupService.createConversationGroup({
            userId: createClassroomDto.userId,
            name: lecture.title,
            description: lecture.description,
            thumbnailUrl: lecture.thumbnailUrl,
            difficultyLevelStart: lecture.difficultyLevelStart,
            difficultyLevelEnd: lecture.difficultyLevelEnd,
            type: CONVERSATION_GROUP_TYPE.LECTURE,
            conversationIds: lecture.lessonIds,
          });
        }),
      );

      const classroom = await this.classroomRepository.save({
        user: { id: createClassroomDto.userId },
        conversationGroups: conversationGroups.map((group) => ({
          id: group.groupId,
        })),
      });

      if (!classroom) {
        throw new ClassroomSaveFailedException();
      }

      return classroom;
    } catch (error) {
      if (error instanceof CustomBaseException) {
        throw error;
      }
      throw new UnexpectedException();
    }
  }

  async getCurrentClassroom({
    userId,
  }: {
    userId: number;
  }): Promise<GetClassroomResponseDto> {
    const [classroom] = await this.classroomRepository.find({
      where: { user: { id: userId } },
      relations: [
        'user',
        'conversationGroups',
        'conversationGroups.conversations',
      ],
      order: {
        updatedAt: 'DESC',
      },
      take: 1,
    });

    if (!classroom) {
      throw new ClassroomNotFoundException();
    }

    const result = new GetClassroomResponseDto();
    result.conversationGroups = await Promise.all(
      classroom.conversationGroups.map(async (group) => ({
        id: group.id,
        name: group.name,
        description: group.description,
        thumbnailUrl: group.thumbnailUrl,
        difficultyLevelStart: group.difficultyLevelStart,
        difficultyLevelEnd: group.difficultyLevelEnd,
        updatedAt: group.updatedAt,
        conversations: await Promise.all(
          group.conversations.map(async (conversation) => ({
            id: conversation.id,
            title: conversation.title,
            situation: conversation.situation,
            difficultyLevel: conversation.difficultyLevel,
            isCompleted: await this.userService.isSolvedConversation({
              userId: classroom.user.id,
              problemId: conversation.problemId,
            }),
          })),
        ),
        isCompleted: false,
      })),
    );

    result.conversationGroups = result.conversationGroups.map((group) => ({
      ...group,
      isCompleted: group.conversations.every((conv) => conv.isCompleted),
    }));

    return result;
  }
}
