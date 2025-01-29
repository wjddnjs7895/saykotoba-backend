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
    private readonly openaiService: OpenAIService,
    @Inject(forwardRef(() => OnboardingService))
    private readonly onboardingService: OnboardingService,
  ) {}

  async getClassroom(classroomId: number): Promise<GetClassroomResponseDto> {
    const classroom = await this.classroomRepository.findOne({
      where: { id: classroomId },
      relations: ['user', 'lectures'],
    });

    if (!classroom) {
      throw new ClassroomNotFoundException();
    }

    const result = new GetClassroomResponseDto();
    result.lectures = await Promise.all(
      classroom.lectures.map(async (lecture) => ({
        id: lecture.id,
        title: lecture.title,
        description: lecture.description,
        thumbnailUrl: lecture.thumbnailUrl,
        difficultyLevelStart: lecture.difficultyLevelStart,
        difficultyLevelEnd: lecture.difficultyLevelEnd,
        updatedAt: lecture.updatedAt,
        conversations: await Promise.all(
          lecture.lessons.map(async (lesson) => ({
            id: lesson.id,
            title: lesson.title,
            situation: lesson.situation,
            difficultyLevel: lesson.difficultyLevel,
            isCompleted: await this.userService.isSolvedConversation({
              userId: classroom.user.id,
              problemId: lesson.id,
            }),
          })),
        ),
        isCompleted: false,
      })),
    );
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

      const classroom = await this.classroomRepository.save({
        user: { id: createClassroomDto.userId },
        lectures: validLectureIds.map((lectureId) => ({
          id: lectureId,
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
      relations: ['user', 'lectures'],
      order: {
        updatedAt: 'DESC',
      },
      take: 1,
    });

    if (!classroom) {
      throw new ClassroomNotFoundException();
    }

    const result = new GetClassroomResponseDto();
    result.lectures = await Promise.all(
      classroom.lectures.map(async (lecture) => ({
        id: lecture.id,
        title: lecture.title,
        description: lecture.description,
        thumbnailUrl: lecture.thumbnailUrl,
        difficultyLevelStart: lecture.difficultyLevelStart,
        difficultyLevelEnd: lecture.difficultyLevelEnd,
        updatedAt: lecture.updatedAt,
        isCompleted: false,
      })),
    );

    return result;
  }
}
