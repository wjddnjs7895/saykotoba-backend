import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm/repository/Repository';
import {
  CreateUserRequestDto,
  CreateUserResponseDto,
} from './dtos/create-user.dto';
import {
  UpdateUserRequestDto,
  UpdateUserResponseDto,
} from './dtos/update-user.dto';
import {
  UserNotFoundException,
  UserUpdateFailedException,
} from '@/common/exception/custom-exception/user.exception';
import { TIER_MAP, TIER_THRESHOLD } from '@/common/constants/user.constants';
import { SubscriptionEntity } from '../payment/entities/subscription.entity';
import { SubscriptionStatus } from './constants/user.constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
  ) {}

  async createUser(
    createUserDto: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    const newUser = this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
    await this.subscriptionRepository.save({
      user: newUser,
      status: SubscriptionStatus.NONE,
    });
    return { userId: newUser.id, email: newUser.email };
  }

  async getUserInfo(id: number) {
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
      solvedProblems: user.solvedProblems,
      subscriptionStatus: user.subscription.status,
    };
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async findUserForAuth(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'name', 'provider'],
    });
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    await this.userRepository.update(id, updateUserDto);
    return { userId: id };
  }

  async removeUser(id: number) {
    return await this.userRepository.delete(id);
  }

  async updateUserExpAndCount(id: number, exp: number, problemId?: number) {
    try {
      await this.userRepository.update(id, {
        exp,
        solvedConversationCount: () => 'solvedConversationCount + 1',
        ...(problemId && {
          solvedProblems: () =>
            `JSON_ARRAY_APPEND(solvedProblems, "$", ${problemId})`,
        }),
      });
      await this.updateUserTier(id);
    } catch {
      throw new UserUpdateFailedException();
    }
  }

  async updateUserTier(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new UserNotFoundException();

    const tier = Object.entries(TIER_THRESHOLD).reduce(
      (highest, [tier, threshold]) => (user.exp >= threshold ? tier : highest),
      'BRONZE_4',
    );

    try {
      if (TIER_MAP[tier as keyof typeof TIER_MAP] !== user.tier) {
        await this.userRepository.update(id, {
          tier: TIER_MAP[tier as keyof typeof TIER_MAP],
        });
      }
    } catch {
      throw new UserUpdateFailedException();
    }
  }
}
