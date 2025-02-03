import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ClassroomEntity } from './entities/classroom.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassroomNotFoundException } from '@/common/exception/custom-exception/classroom.exception';
import { GetClassroomResponseDto } from './dtos/get-classroom.dto';
import { UserService } from '../user/services/user.service';
import { CreateClassroomServiceDto } from './dtos/create-classroom.dto';
import { LectureService } from '../lecture/lecture.service';
import { OpenAIService } from '@/integrations/openai/openai.service';
import { CustomBaseException } from '@/common/exception/custom.base.exception';
import { UnexpectedException } from '@/common/exception/custom-exception/unexpected.exception';
import { OnboardingService } from '../user/services/onboarding.service';
import { S3Service } from '@/integrations/aws/services/s3/s3.service';
import { ClassroomLectureEntity } from './entities/classroom-lecture.entity';
import { interleaveArrays } from './utils/array.utils';
import {
  StartClassroomByOrderResponseDto,
  StartClassroomByOrderServiceDto,
} from './dtos/start-classroom-by-order.dto';

@Injectable()
export class ClassroomService {
  constructor(
    @InjectRepository(ClassroomEntity)
    private readonly classroomRepository: Repository<ClassroomEntity>,
    @InjectRepository(ClassroomLectureEntity)
    private readonly classroomLectureRepository: Repository<ClassroomLectureEntity>,
    private readonly userService: UserService,
    private readonly lectureService: LectureService,
    private readonly openaiService: OpenAIService,
    @Inject(forwardRef(() => OnboardingService))
    private readonly onboardingService: OnboardingService,
    private readonly s3Service: S3Service,
  ) {}

  async createClassroom(createClassroomDto: CreateClassroomServiceDto) {
    try {
      const lectures = await this.lectureService.getAllLectures(
        createClassroomDto.language,
      );

      const grammarLectures = lectures.filter((lecture) =>
        lecture.topics.some((topic) => topic === 'Grammar'),
      );

      const conversationLectures = lectures.filter(
        (lecture) => !lecture.topics.some((topic) => topic === 'Grammar'),
      );

      const startIndex = createClassroomDto.difficultyLevel * 3;
      const selectedGrammarLectures = grammarLectures.slice(startIndex);
      const grammarIds = selectedGrammarLectures.map((lecture) => lecture.id);

      const interests = await this.onboardingService.getInterestList();

      const aiConversationSelectResult =
        await this.openaiService.generateClassroom({
          language: createClassroomDto.language,
          interests: interests.interests
            .filter((interest) =>
              createClassroomDto.interestIds.includes(interest.id),
            )
            .map((interest) => interest.interest),
          requiredStatement: createClassroomDto.requiredStatement,
          difficultyLevel: createClassroomDto.difficultyLevel,
          lectures: await Promise.all(
            conversationLectures.map(async (lecture) => ({
              id: lecture.id,
              title: lecture.title,
              description: lecture.description,
              thumbnailUrl: lecture.thumbnailUrl,
              difficultyLevelStart: lecture.difficultyLevelStart,
              difficultyLevelEnd: lecture.difficultyLevelEnd,
              lessons: await Promise.all(
                lecture.lessons.map(async (lesson) =>
                  this.lectureService.getLessonInfo(lesson.id),
                ),
              ),
            })),
          ),
        });

      const combinedLectureIds = interleaveArrays(
        grammarIds,
        aiConversationSelectResult.lectureIds,
      );

      const validLectureIds =
        createClassroomDto.style !== 2
          ? combinedLectureIds.filter((lectureId) =>
              lectures.some((l) => l.id === lectureId),
            )
          : [...grammarIds];

      const classroom = await this.classroomRepository.save({
        user: { id: createClassroomDto.userId },
      });

      const orderedValidLectureIds = lectures
        .filter((lecture) => validLectureIds.includes(lecture.id))
        .map((lecture) => lecture.id);

      await this.classroomLectureRepository.save(
        orderedValidLectureIds.map((lectureId, index) => ({
          classroomId: classroom.id,
          lectureId: lectureId,
          order: index,
        })),
      );

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
      relations: ['user', 'classroomLectures', 'classroomLectures.lecture'],
      order: {
        classroomLectures: {
          order: 'ASC',
        },
      },
      take: 1,
    });

    if (!classroom) {
      throw new ClassroomNotFoundException();
    }

    const result = new GetClassroomResponseDto();
    result.lectures = await Promise.all(
      classroom.classroomLectures.map(async (classroomLecture) => ({
        id: classroomLecture.lecture.id,
        title: classroomLecture.lecture.title,
        description: classroomLecture.lecture.description,
        thumbnailUrl: this.s3Service.getCloudFrontUrl(
          classroomLecture.lecture.thumbnailUrl,
        ),
        difficultyLevelStart: classroomLecture.lecture.difficultyLevelStart,
        difficultyLevelEnd: classroomLecture.lecture.difficultyLevelEnd,
        updatedAt: classroomLecture.lecture.updatedAt,
        isCompleted: false,
      })),
    );

    result.recentLectureOrder = classroom.recentLectureOrder;
    result.recentLessonOrder = classroom.recentLessonOrder;
    result.classroomId = classroom.id;

    return result;
  }

  async startClassroomByOrder({
    userId,
    classroomId,
    lectureOrder,
    lessonOrder,
  }: StartClassroomByOrderServiceDto): Promise<StartClassroomByOrderResponseDto> {
    const classroomLecture = await this.classroomLectureRepository.findOne({
      where: { classroomId, order: lectureOrder },
      relations: ['lecture', 'lecture.lessons'],
    });

    if (!classroomLecture) {
      throw new ClassroomNotFoundException();
    }

    const newConversation = await this.lectureService.startLesson({
      userId,
      lessonId: classroomLecture.lecture.lessons[lessonOrder].id,
    });

    const totalLessons = classroomLecture.lecture.lessons.length;
    let nextLectureOrder = lectureOrder;
    let nextLessonOrder = lessonOrder;

    if (lessonOrder >= totalLessons - 1) {
      const nextClassroomLecture =
        await this.classroomLectureRepository.findOne({
          where: { classroomId, order: lectureOrder + 1 },
        });

      if (nextClassroomLecture) {
        nextLectureOrder = lectureOrder + 1;
        nextLessonOrder = 0;
      }
    } else {
      nextLessonOrder = lessonOrder + 1;
    }

    await this.classroomRepository.update(classroomId, {
      recentLectureOrder: nextLectureOrder,
      recentLessonOrder: nextLessonOrder,
    });

    return {
      conversationId: newConversation.conversationId,
      lectureOrder: nextLectureOrder,
      lessonOrder: nextLessonOrder,
    };
  }
}
