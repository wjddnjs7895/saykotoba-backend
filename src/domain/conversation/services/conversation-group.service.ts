import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ConversationGroupEntity } from '../entities/conversation_group.entity';
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
import { AddConversationToGroupRequestDto } from '../dtos/add-conversation-to-group.dto';
import { ConversationEntity } from '../entities/conversation.entity';
import { CONVERSATION_GROUP_TYPE } from '@/common/constants/conversation.constants';
import { GetConversationGroupInfoResponseDto } from '../dtos/get-conversation-group-info.dto';
import { S3Service } from '@/integrations/aws/services/s3/s3.service';
import { LogParams } from '@/common/decorators/log-params.decorator';
@Injectable()
export class ConversationGroupService {
  constructor(
    @InjectRepository(ConversationGroupEntity)
    private readonly conversationGroupRepository: Repository<ConversationGroupEntity>,
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
    private readonly s3Service: S3Service,
  ) {}

  @LogParams()
  async getUserConversationGroups(
    userId: number,
  ): Promise<GetUserConversationGroupResponseDto[]> {
    try {
      const groups = await this.conversationGroupRepository.find({
        where: { user: { id: userId } },
        order: {
          updatedAt: 'DESC',
        },
      });
      if (!groups) {
        throw new ConversationGroupNotFoundException();
      }
      return groups.map((group) => ({
        id: group.id,
        name: group.name,
        description: group.description,
        thumbnailUrl: this.s3Service.getCloudFrontUrl(group.thumbnailUrl),
      }));
    } catch (error) {
      if (error instanceof CustomBaseException) {
        throw error;
      }
      throw new UnexpectedException(error.message);
    }
  }

  @LogParams()
  async getUserLectureGroups(
    userId: number,
  ): Promise<GetLectureGroupResponseDto[]> {
    const groups = await this.conversationGroupRepository.find({
      where: { user: { id: userId }, type: CONVERSATION_GROUP_TYPE.LECTURE },
      relations: ['user'],
      order: {
        updatedAt: 'DESC',
      },
    });
    return groups.map((group) => ({
      id: group.id,
      name: group.name,
      description: group.description,
      thumbnailUrl: this.s3Service.getCloudFrontUrl(group.thumbnailUrl),
      difficultyLevelStart: group.difficultyLevelStart,
      difficultyLevelEnd: group.difficultyLevelEnd,
    }));
  }

  @LogParams()
  async createConversationGroup(
    conversationGroup: CreateConversationGroupRequestDto,
  ): Promise<CreateConversationGroupResponseDto> {
    try {
      const newGroup = this.conversationGroupRepository.create({
        ...conversationGroup,
        user: { id: conversationGroup.userId },
      });

      const savedGroup = await this.conversationGroupRepository.save(newGroup);
      return {
        groupId: savedGroup.id,
      };
    } catch {
      throw new ConversationGroupSaveFailedException();
    }
  }

  @LogParams()
  async addConversationToGroup(
    addConversationToGroupDto: AddConversationToGroupRequestDto,
  ): Promise<void> {
    const group = await this.conversationGroupRepository.findOne({
      where: { id: addConversationToGroupDto.groupId },
    });
    const conversations = await this.conversationRepository.find({
      where: { id: In(addConversationToGroupDto.conversationIds) },
    });
    group.conversations = [...group.conversations, ...conversations];
    await this.conversationGroupRepository.save(group);
  }

  @LogParams()
  async getUserConversationGroupInfo(
    groupId: number,
  ): Promise<GetConversationGroupInfoResponseDto> {
    const group = await this.conversationGroupRepository.findOne({
      where: { id: groupId },
      relations: ['conversations'],
    });
    const conversationGroupInfo = {
      id: group.id,
      title: group.name,
      description: group.description,
      thumbnailUrl: this.s3Service.getCloudFrontUrl(group.thumbnailUrl),
      difficultyLevelStart: group.difficultyLevelStart,
      difficultyLevelEnd: group.difficultyLevelEnd,
      conversations: group.conversations.map((conversation) => ({
        id: conversation.id,
        title: conversation.title,
        isCompleted: conversation.isCompleted,
        score: conversation.score,
        difficultyLevel: conversation.difficultyLevel,
      })),
    };
    return conversationGroupInfo;
  }
}
