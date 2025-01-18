import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ConversationGroupEntity,
  ConversationGroupType,
} from '../entities/conversation_group.entity';
import { GetUserConversationGroupResponseDto } from '../dtos/get-user-conversation-group.dto';
import {
  CreateConversationGroupRequestDto,
  CreateConversationGroupResponseDto,
} from '../dtos/create-conversation-group.dto';
import {
  ConversationGroupNotFoundException,
  ConversationGroupSaveFailedException,
} from '@/common/exception/custom-exception/conversation.exception';
import { CustomBaseException } from '@/common/exception/custom.base.exception';
import { UnexpectedException } from '@/common/exception/custom-exception/unexpected.exception';
import { GetLectureGroupResponseDto } from '../dtos/get-user-lecture-group.dto';

@Injectable()
export class ConversationGroupService {
  constructor(
    @InjectRepository(ConversationGroupEntity)
    private readonly conversationGroupRepository: Repository<ConversationGroupEntity>,
  ) {}

  async createConversationGroup(
    conversationGroup: CreateConversationGroupRequestDto,
  ): Promise<CreateConversationGroupResponseDto> {
    try {
      const newGroup =
        this.conversationGroupRepository.create(conversationGroup);
      const savedGroup = await this.conversationGroupRepository.save(newGroup);
      return {
        id: savedGroup.id,
      };
    } catch {
      throw new ConversationGroupSaveFailedException();
    }
  }

  async getUserConversationGroups(
    userId: number,
  ): Promise<GetUserConversationGroupResponseDto[]> {
    try {
      const groups = await this.conversationGroupRepository.find({
        where: { user: { id: userId } },
      });
      if (!groups) {
        throw new ConversationGroupNotFoundException();
      }
      return groups.map((group) => ({
        id: group.id,
        name: group.name,
        description: group.description,
        thumbnailUrl: group.thumbnailUrl,
      }));
    } catch (error) {
      if (error instanceof CustomBaseException) {
        throw error;
      }
      throw new UnexpectedException();
    }
  }

  async getUserLectureGroups(
    userId: number,
  ): Promise<GetLectureGroupResponseDto[]> {
    const groups = await this.conversationGroupRepository.find({
      where: { user: { id: userId }, type: ConversationGroupType.LECTURE },
      relations: ['user'],
    });
    return groups.map((group) => ({
      id: group.id,
      name: group.name,
      description: group.description,
      thumbnailUrl: group.thumbnailUrl,
      difficultyLevel: group.difficultyLevel,
    }));
  }
}
