import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity, MessageRole } from './entities/message.entity';
import { OpenAIService } from '../../integrations/openai/openai.service';
import {
  GenerateScenarioRequestDto,
  GenerateScenarioResponseDto,
} from './dtos/generate-scenario';
import { ConversationEntity } from './entities/conversation.entity';
import {
  CreateConversationResponseDto,
  CreateConversationServiceDto,
} from './dtos/create-conversation.dto';
import { MissionEntity } from './entities/mission.entity';
import { MissionResultType } from '../../integrations/openai/tools/conversation-response.tool';
import { GetConversationListResponseDto } from './dtos/get-conversation-list.dto';
import { GetConversationInfoResponseDto } from './dtos/get-conversation-info.dto';
import { S3Service } from '@/integrations/aws/services/s3/s3.service';
import { ChatResponseDto } from './dtos/chat-response';
import {
  ConversationNotFoundException,
  ConversationSaveFailedException,
  MessageNotFoundException,
  MessageSaveFailedException,
  MissionNotFoundException,
  MissionSaveFailedException,
} from '@/common/exception/custom-exception/conversation.exception';
import { CustomBaseException } from '@/common/exception/custom.base.exception';
import { UnexpectedException } from '@/common/exception/custom-exception/unexpected.exception';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(MissionEntity)
    private readonly missionRepository: Repository<MissionEntity>,
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
    private readonly openAIService: OpenAIService,
    private readonly s3Service: S3Service,
  ) {}

  async getConversationsByUserId(
    userId: number,
  ): Promise<GetConversationListResponseDto[]> {
    const conversations = await this.conversationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    if (!conversations || conversations.length === 0) {
      throw new ConversationNotFoundException();
    }

    return conversations.map((conversation) => ({
      conversationId: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt,
    }));
  }

  async getAllMessage(conversationId: number): Promise<MessageEntity[]> {
    const messages = await this.messageRepository.find({
      where: { conversationId },
      order: {
        createdAt: 'ASC',
      },
    });

    if (!messages || messages.length === 0) {
      throw new MessageNotFoundException();
    }

    return messages;
  }

  async processAudioResponse(
    conversationId: number,
    audio: Express.Multer.File,
  ) {
    const conversationInfo = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['missions'],
    });

    if (!conversationInfo) {
      throw new ConversationNotFoundException();
    }

    const messages = await this.getAllMessage(conversationId);

    if (messages.length === 0) {
      throw new MessageNotFoundException();
    }

    const { response, missionResults, suggestedReplies } =
      await this.openAIService.processAudioAndGenerateResponse(
        conversationInfo,
        messages,
        audio,
      );

    return {
      text: response,
      missionResults,
      suggestedReplies,
    };
  }

  // async processTextResponse(conversationId: number, userText: string) {
  //   const conversationInfo = await this.conversationRepository.findOne({
  //     where: { id: conversationId },
  //     relations: ['missions'],
  //   });
  //   const messages = await this.getAllMessage(conversationId);
  //   const { response, missionResults } =
  //     await this.openAIService.processTextAndGenerateResponse(
  //       conversationInfo,
  //       messages,
  //       userText,
  //     );

  //   return {
  //     text: response,
  //     missionResults,
  //   };
  // }

  async generateScenario(
    generateScenarioDto: GenerateScenarioRequestDto,
  ): Promise<GenerateScenarioResponseDto> {
    return this.openAIService.generateScenario(generateScenarioDto);
  }

  async getConversationInfo(
    conversationId: number,
  ): Promise<GetConversationInfoResponseDto> {
    const conversationInfo = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['missions'],
    });

    if (!conversationInfo) {
      throw new ConversationNotFoundException();
    }

    const response = new GetConversationInfoResponseDto();
    response.title = conversationInfo.title;
    response.situation = conversationInfo.situation;
    response.missions = conversationInfo.missions.map((mission) => ({
      mission: mission.mission,
      isCompleted: mission.isCompleted,
    }));
    return response;
  }

  async createConversation(
    createConversationDto: CreateConversationServiceDto,
  ): Promise<CreateConversationResponseDto> {
    try {
      const newConversation = this.conversationRepository.create({
        userId: createConversationDto.userId,
        title: createConversationDto.title,
        difficultyLevel: createConversationDto.difficultyLevel,
        situation: createConversationDto.situation,
        aiRole: createConversationDto.aiRole,
        userRole: createConversationDto.userRole,
      });
      try {
        await this.conversationRepository.save(newConversation);
      } catch {
        throw new ConversationSaveFailedException();
      }

      const missionPromises = createConversationDto.missions.map((mission) =>
        this.missionRepository.save({
          conversationId: newConversation.id,
          mission,
          isCompleted: false,
        }),
      );
      try {
        await Promise.all(missionPromises);
      } catch {
        throw new MissionSaveFailedException();
      }

      const firstMessage = await this.getFirstMessage(createConversationDto);
      try {
        await this.messageRepository.save({
          conversationId: newConversation.id,
          messageText: firstMessage,
          role: MessageRole.ASSISTANT,
        });
      } catch {
        throw new MessageSaveFailedException();
      }

      return { conversationId: newConversation.id };
    } catch (error) {
      if (error instanceof CustomBaseException) {
        throw error;
      }
      throw new UnexpectedException();
    }
  }

  async getFirstMessage(
    conversationInfo: CreateConversationServiceDto,
  ): Promise<string> {
    return await this.openAIService.getFirstMessage(conversationInfo);
  }

  async getAndProcessConversationFromAudio(
    conversationId: number,
    audio: Express.Multer.File,
  ): Promise<ChatResponseDto> {
    try {
      const userText = await this.openAIService.getTextFromAudio(audio);

      try {
        await this.messageRepository.save({
          conversationId,
          messageText: userText,
          role: MessageRole.USER,
        });
      } catch {
        throw new MessageSaveFailedException();
      }

      const aiResponse = await this.processAudioResponse(conversationId, audio);

      try {
        await this.messageRepository.save({
          conversationId,
          messageText: aiResponse.text,
          role: MessageRole.ASSISTANT,
        });
      } catch {
        throw new MessageSaveFailedException();
      }

      const updatedMissions = await this.updateMissionStatus(
        conversationId,
        aiResponse.missionResults,
      );

      return {
        userMessage: userText,
        assistantMessage: aiResponse.text,
        missions: updatedMissions,
        suggestedReplies: aiResponse.suggestedReplies,
      };
    } catch (error) {
      if (error instanceof CustomBaseException) {
        throw error;
      }
      throw new UnexpectedException();
    }
  }

  // async getAndProcessConversationFromText(
  //   conversationId: number,
  //   userText: string,
  // ) {
  //   try {
  //     const userMessage = await this.saveMessage(
  //       conversationId,
  //       userText,
  //       MessageRole.USER,
  //     );

  //     const aiResponse = await this.processTextResponse(
  //       conversationId,
  //       userText,
  //     );

  //     const assistantMessage = await this.saveMessage(
  //       conversationId,
  //       aiResponse.text,
  //       MessageRole.ASSISTANT,
  //     );

  //     const updatedMissions = await this.updateMissionStatus(
  //       conversationId,
  //       aiResponse.missionResults,
  //     );

  //     return {
  //       userMessage,
  //       assistantMessage,
  //       missions: updatedMissions,
  //     };
  //   } catch (error) {
  //     throw new Error('대화 처리 중 오류가 발생했습니다: ' + error.message);
  //   }
  // }

  async updateMissionStatus(
    conversationId: number,
    missionResults: MissionResultType[],
  ) {
    try {
      const updatePromises = missionResults.map(async (missionResult) => {
        const mission = await this.missionRepository.findOne({
          where: {
            conversationId,
            id: missionResult.missionId,
          },
        });

        if (!mission) {
          throw new MissionNotFoundException();
        }

        mission.isCompleted = missionResult.isCompleted;
        try {
          return this.missionRepository.save(mission);
        } catch {
          throw new MissionSaveFailedException();
        }
      });

      await Promise.all(updatePromises);

      return await this.missionRepository.findBy({ conversationId });
    } catch (error) {
      if (error instanceof CustomBaseException) {
        throw error;
      }
      throw new UnexpectedException();
    }
  }

  async getFeedBack(conversationId: number) {
    const conversationInfo = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['messages'],
    });
    if (!conversationInfo) {
      throw new ConversationNotFoundException();
    }
    return await this.openAIService.getFeedBack({
      messages: conversationInfo.messages,
      difficulty: conversationInfo.difficultyLevel,
      language: 'ja',
    });
  }
}
