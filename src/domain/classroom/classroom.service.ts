import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ClassroomEntity } from './entities/classroom.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassroomNotFoundException } from '@/common/exception/custom-exception/classroom.exception';
import { GetClassroomResponseDto } from './dtos/get-classroom.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class ClassroomService {
  constructor(
    @InjectRepository(ClassroomEntity)
    private readonly classroomRepository: Repository<ClassroomEntity>,
    private readonly userService: UserService,
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
          classroomConversationGroup.conversationGroup.conversations.map(
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
          id: classroomConversationGroup.conversationGroup.id,
          name: classroomConversationGroup.conversationGroup.name,
          description: classroomConversationGroup.conversationGroup.description,
          thumbnailUrl:
            classroomConversationGroup.conversationGroup.thumbnailUrl,
          difficultyLevelStart:
            classroomConversationGroup.conversationGroup.difficultyLevelStart,
          difficultyLevelEnd:
            classroomConversationGroup.conversationGroup.difficultyLevelEnd,
          updatedAt: classroomConversationGroup.conversationGroup.updatedAt,
          conversations,
          isCompleted,
        };
      }),
    );

    return result;
  }
}
