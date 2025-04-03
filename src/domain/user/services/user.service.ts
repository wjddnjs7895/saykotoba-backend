import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository, DataSource, In } from 'typeorm';
import {
  CreateUserRequestDto,
  CreateUserResponseDto,
} from '../dtos/create-user.dto';
import {
  UpdateUserRequestDto,
  UpdateUserResponseDto,
} from '../dtos/update-user.dto';
import {
  UserNotFoundException,
  UserTierUpdateFailedException,
  UserUpdateFailedException,
} from '@/common/exception/custom-exception/user.exception';
import {
  SubscriptionStatus,
  TIER_MAP,
  TIER_THRESHOLD,
} from '@/common/constants/user.constants';
import { SubscriptionEntity } from '../../payment/entities/subscription.entity';
import { CustomBaseException } from '@/common/exception/custom.base.exception';
import { LogParams } from '@/common/decorators/log-params.decorator';
import { ConversationGroupEntity } from '@/domain/conversation/entities/conversation_group.entity';
import { ClassroomEntity } from '@/domain/classroom/entities/classroom.entity';
import { GetUserInfoRespondDto } from '../dtos/get-user-info.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  @LogParams()
  async createUser(
    createUserDto: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    const newUser = this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
    await this.subscriptionRepository.save({
      user: newUser,
      status: SubscriptionStatus.NONE,
    });
    return {
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
  }

  @LogParams()
  async getUserInfo({ id }: { id: number }): Promise<GetUserInfoRespondDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['subscription'],
    });
    if (!user) throw new UserNotFoundException();
    return {
      userId: user.id,
      isOnboardingCompleted: user.isOnboardingCompleted,
      name: user.name,
      exp: user.exp,
      tier: user.tier,
      solvedConversationCount: user.solvedConversationCount,
      solvedProblemIds: user.solvedProblemIds,
      solvedConversationIds: user.solvedConversationIds,
      subscriptionStatus: user.subscription.status,
      expiresAt: user.subscription.expiresAt,
      freeTrialCount: user.freeTrialCount,
    };
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async findUserForAuth(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'name', 'provider', 'role'],
    });
  }

  @LogParams()
  async updateUser(
    id: number,
    updateUserDto: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    await this.userRepository.update(id, updateUserDto);
    return { userId: id };
  }

  @LogParams()
  async removeUser(id: number) {
    return await this.userRepository.delete(id);
  }

  @LogParams()
  async updateUserExpAndCount({
    userId,
    exp,
  }: {
    userId: number;
    exp: number;
  }) {
    try {
      await this.userRepository.increment({ id: userId }, 'exp', exp);
      await this.userRepository.increment(
        { id: userId },
        'solvedConversationCount',
        1,
      );
      await this.updateUserTier(userId);
    } catch (error) {
      if (error instanceof CustomBaseException) {
        throw error;
      }
      throw new UserUpdateFailedException();
    }
  }

  @LogParams()
  async addSolvedIds({
    userId,
    conversationId,
    problemId,
  }: {
    userId: number;
    conversationId?: number;
    problemId?: number;
  }) {
    const user = await this.userRepository.findOneBy({ id: userId });
    try {
      if (
        conversationId &&
        !user.solvedConversationIds.includes(conversationId)
      ) {
        user.solvedConversationIds = [
          ...user.solvedConversationIds,
          conversationId,
        ];
      }
      if (problemId && !user.solvedProblemIds.includes(problemId)) {
        user.solvedProblemIds = [...user.solvedProblemIds, problemId];
      }
      await this.userRepository.save(user);
    } catch {
      throw new UserUpdateFailedException();
    }
  }

  @LogParams()
  async updateUserTier(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new UserNotFoundException();

    const sortedTiers = Object.entries(TIER_THRESHOLD).sort(
      (a, b) => b[1] - a[1],
    );

    let currentTier = sortedTiers[sortedTiers.length - 1][0];

    for (let i = 0; i < sortedTiers.length; i++) {
      const [tier, threshold] = sortedTiers[i];
      if (user.exp >= threshold) {
        if (i > 0) {
          currentTier = sortedTiers[i - 1][0];
        } else {
          currentTier = tier;
        }
        break;
      }
    }

    try {
      const newTier = TIER_MAP[currentTier as keyof typeof TIER_MAP];
      if (newTier !== user.tier) {
        await this.userRepository.update(id, { tier: newTier });
      }
    } catch {
      throw new UserTierUpdateFailedException();
    }
  }

  @LogParams()
  async getTierList(): Promise<{
    tierList: { tier: string; threshold: number }[];
  }> {
    return {
      tierList: Object.entries(TIER_THRESHOLD).map(([tier, threshold]) => ({
        tier,
        threshold,
      })),
    };
  }

  @LogParams()
  async isSolvedConversation({
    userId,
    conversationId,
    problemId,
  }: {
    userId: number;
    conversationId?: number;
    problemId?: number;
  }) {
    const user = await this.userRepository.findOneBy({ id: userId });
    return (
      user.solvedConversationIds.includes(conversationId) ||
      user.solvedProblemIds.includes(problemId)
    );
  }

  async withdrawUser(userId: number): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      // 1. 개인정보 익명화 (GDPR 등 규정 준수)
      await manager.update(UserEntity, userId, {
        email: `withdrawn_${userId}_${Date.now()}@email.com`,
        name: 'withdrawn_user',
        password: null,
        googleId: null,
        appleId: null,
        isWithdrawn: true,
      });
      await manager.softDelete(SubscriptionEntity, { user: { id: userId } });
      await manager.softDelete(ConversationGroupEntity, {
        user: { id: userId },
      });
      await manager.softDelete(ClassroomEntity, { user: { id: userId } });
      await manager.softDelete(UserEntity, userId);
    });
  }

  async hasFreeTrial({ userId }: { userId: number }): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ id: userId });
    return user.freeTrialCount > 0;
  }

  async useFreeTrial({ userId }: { userId: number }): Promise<void> {
    await this.userRepository.decrement({ id: userId }, 'freeTrialCount', 1);
  }

  /**
   * 현지 시간 기준 자정에 사용자의 무료 체험 횟수를 초기화합니다.
   * 시간대별로 사용자를 그룹화하여 각 그룹의 현지 시간이 자정일 때 초기화합니다.
   */
  @Cron('0,15,30,45 * * * *') // 매 15분마다 실행
  @LogParams()
  async resetFreeTrialCountAtMidnight(): Promise<void> {
    // 모든 사용자와 그들의 시간대 정보를 가져옵니다
    const users = await this.userRepository.find({
      select: ['id', 'timezone', 'freeTrialCount'],
    });

    // 시간대별로 사용자 그룹화
    const usersByTimezone = users.reduce(
      (acc, user) => {
        const timezone = user.timezone || 'UTC'; // 기본값은 UTC
        if (!acc[timezone]) {
          acc[timezone] = [];
        }
        acc[timezone].push(user);
        return acc;
      },
      {} as Record<string, UserEntity[]>,
    );

    // 각 시간대별로 현재 시간 확인 및 처리
    for (const [timezone, timezoneUsers] of Object.entries(usersByTimezone)) {
      try {
        // 해당 시간대의 현재 시간 계산
        const now = new Date();
        const localTime = new Date(
          now.toLocaleString('en-US', { timeZone: timezone }),
        );

        // 현지 시간이 자정(00:00~00:14) 범위인지 확인
        if (localTime.getHours() === 0 && localTime.getMinutes() < 15) {
          // 해당 시간대의 사용자들 freeTrialCount 초기화
          const userIds = timezoneUsers.map((user) => user.id);
          await this.userRepository.update(
            { id: In(userIds) },
            { freeTrialCount: 10 },
          );
        }
      } catch (error) {
        console.error(
          `시간대 ${timezone}의 사용자 무료 체험 초기화 중 오류 발생:`,
          error,
        );
      }
    }
  }
}
