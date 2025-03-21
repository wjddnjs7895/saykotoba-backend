import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UpdateUserOnboardingRequestDto } from '../dtos/update-user-onboarding.dto';
import {
  UserNotFoundException,
  UserUpdateFailedException,
} from '@/common/exception/custom-exception/user.exception';
import { UnexpectedException } from '@/common/exception/custom-exception/unexpected.exception';
import { GetInterestListResponseDto } from '../dtos/get-interest.dto';
import { InterestEntity } from '../entities/interest.entity';
import { ClassroomService } from '@/domain/classroom/classroom.service';
import { CustomBaseException } from '@/common/exception/custom.base.exception';
import { LogParams } from '@/common/decorators/log-params.decorator';
import { PaymentService } from '@/domain/payment/payment.service';

@Injectable()
export class OnboardingService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(InterestEntity)
    private readonly interestRepository: Repository<InterestEntity>,
    private readonly paymentService: PaymentService,
    private readonly classroomService: ClassroomService,
  ) {}

  @LogParams()
  async updateUserOnboarding(
    userId: number,
    updateUserOnboardingDto: UpdateUserOnboardingRequestDto,
  ) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['interests'],
      });

      if (!user) throw new UserNotFoundException();
      if (user.isOnboardingCompleted) throw new UserUpdateFailedException();
      await this.classroomService.createClassroom({
        userId,
        ...updateUserOnboardingDto,
      });

      try {
        user.name = updateUserOnboardingDto.name;
        user.isOnboardingCompleted = true;
        user.interests = updateUserOnboardingDto.interestIds.map(
          (id) => ({ id }) as InterestEntity,
        );

        await this.userRepository.save(user);
        await this.paymentService.startTrial({ userId });
      } catch {
        throw new UserUpdateFailedException();
      }
    } catch (error) {
      if (error instanceof CustomBaseException) {
        throw error;
      }
      throw new UnexpectedException(error.message);
    }
  }

  @LogParams()
  async updateUserOnboardingStatus(userId: number) {
    const result = await this.userRepository.update(userId, {
      isOnboardingCompleted: true,
    });
    if (!result.affected) throw new UserUpdateFailedException();
  }

  @LogParams()
  async isOnboardingCompleted(userId: number): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new UserNotFoundException();
    return user.isOnboardingCompleted;
  }

  @LogParams()
  async getInterestList(): Promise<GetInterestListResponseDto> {
    const interests = await this.interestRepository.find();
    const interestList = interests.map((interest) => ({
      id: interest.id,
      shortName: interest.shortName,
      interest: interest.interest,
    }));
    return {
      interests: interestList,
    };
  }
}
