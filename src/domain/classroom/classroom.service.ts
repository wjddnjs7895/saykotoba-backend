import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ClassroomEntity } from './entities/classroom.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ClassroomGenerateFailedException,
  ClassroomNotFoundException,
  ClassroomSaveFailedException,
} from '@/common/exception/custom-exception/classroom.exception';
import { GetClassroomResponseDto } from './dtos/get-classroom.dto';
import { UserService } from '../user/user.service';
import { CreateClassroomServiceDto } from './dtos/create-classroom.dto';
import { LectureService } from '../lecture/lecture.service';
import { ConversationGroupService } from '../conversation/services/conversation-group.service';
import { CONVERSATION_GROUP_TYPE } from '@/common/constants/conversation.constants';
import { OpenAIService } from '@/integrations/openai/openai.service';
import { CustomBaseException } from '@/common/exception/custom.base.exception';
import { UnexpectedException } from '@/common/exception/custom-exception/unexpected.exception';
import { ConversationGroupSaveFailedException } from '@/common/exception/custom-exception/conversation.exception';

@Injectable()
export class ClassroomService {
  constructor(
    @InjectRepository(ClassroomEntity)
    private readonly classroomRepository: Repository<ClassroomEntity>,
    private readonly userService: UserService,
    private readonly lectureService: LectureService,
    private readonly conversationGroupService: ConversationGroupService,
    private readonly openaiService: OpenAIService,
  ) {}

  async getClassroom(classroomId: number): Promise<GetClassroomResponseDto> {
    const classroom = await this.classroomRepository.findOne({
      where: { id: classroomId },
      relations: [
        'conversationGroups',
        'conversationGroups.conversationGroup',
        'conversationGroups.conversationGroup.conversations',
      ],
    });

    if (!classroom) {
      throw new ClassroomNotFoundException();
    }

    const result = new GetClassroomResponseDto();
    result.conversationGroups = await Promise.all(
      classroom.conversationGroups.map(async (classroomConversationGroup) => {
        const conversations = await Promise.all(
          classroomConversationGroup.conversations.map(
            async (conversation) => ({
              id: conversation.id,
              title: conversation.title,
              situation: conversation.situation,
              difficultyLevel: conversation.difficultyLevel,
              isCompleted: await this.userService.isSolvedConversation({
                userId: classroom.user.id,
                problemId: conversation.problemId,
              }),
            }),
          ),
        );

        const isCompleted = conversations.every(
          (conversation) => conversation.isCompleted,
        );

        return {
          id: classroomConversationGroup.id,
          name: classroomConversationGroup.name,
          description: classroomConversationGroup.description,
          thumbnailUrl: classroomConversationGroup.thumbnailUrl,
          difficultyLevelStart: classroomConversationGroup.difficultyLevelStart,
          difficultyLevelEnd: classroomConversationGroup.difficultyLevelEnd,
          updatedAt: classroomConversationGroup.updatedAt,
          conversations,
          isCompleted,
        };
      }),
    );

    return result;
  }

  async createClassroom(createClassroomDto: CreateClassroomServiceDto) {
    try {
      const lectures = await this.lectureService.getAllLectures(
        createClassroomDto.language,
      );

      const aiSelectResult = await this.openaiService.generateClassroom({
        language: createClassroomDto.language,
        style: createClassroomDto.style,
        topics: createClassroomDto.topics,
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

      if (validLectureIds.length !== aiSelectResult.lectureIds.length) {
        throw new ClassroomGenerateFailedException();
      }

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

      if (conversationGroups.length !== validLectureIds.length) {
        throw new ConversationGroupSaveFailedException();
      }

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
}
