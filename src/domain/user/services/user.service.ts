import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository, DataSource } from 'typeorm';
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
}
