import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity, MessageRole } from './entities/message.entity';
import { OpenAIService } from '../openai/openai.service';
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
import { MissionResultType } from '../openai/tools/conversation-response.tool';
import { GetConversationListResponseDto } from './dtos/get-conversation-list.dto';
import { GetConversationInfoResponseDto } from './dtos/get-conversation-info.dto';

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
  ) {}

  async getConversationsByUserId(
    userId: number,
  ): Promise<GetConversationListResponseDto[]> {
    const conversations = await this.conversationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return conversations.map((conversation) => ({
      conversationId: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt,
    }));
  }

  async getAllMessage(conversationId: number) {
    return this.messageRepository.find({
      where: { conversationId },
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async processAudioResponse(
    conversationId: number,
    audio: Express.Multer.File,
  ) {
    const conversationInfo = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['missions'],
    });
    const messages = await this.getAllMessage(conversationId);
    const { response, missionResults } =
      await this.openAIService.processAudioAndGenerateResponse(
        conversationInfo,
        messages,
        audio,
      );

    return {
      text: response,
      missionResults,
    };
  }

  async processTextResponse(conversationId: number, userText: string) {
    const conversationInfo = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['missions'],
    });
    const messages = await this.getAllMessage(conversationId);
    const { response, missionResults } =
      await this.openAIService.processTextAndGenerateResponse(
        conversationInfo,
        messages,
        userText,
      );

    return {
      text: response,
      missionResults,
    };
  }

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
      // 대화 생성
      const newConversation = this.conversationRepository.create({
        userId: createConversationDto.userId,
        title: createConversationDto.title,
        difficulty: createConversationDto.difficulty,
        situation: createConversationDto.situation,
        aiRole: createConversationDto.aiRole,
        userRole: createConversationDto.userRole,
      });
      await this.conversationRepository.save(newConversation);

      // 미션 생성
      const missionPromises = createConversationDto.missions.map((mission) =>
        this.missionRepository.save({
          conversationId: newConversation.id,
          mission,
          isCompleted: false,
        }),
      );
      await Promise.all(missionPromises);

      // 첫 메시지 생성
      const firstMessage = await this.getFirstMessage(newConversation);
      await this.saveMessage(
        newConversation.id,
        firstMessage,
        MessageRole.ASSISTANT,
      );

      return { conversationId: newConversation.id };
    } catch (error) {
      throw new Error(
        '새로운 대화 생성 중 오류가 발생했습니다: ' + error.message,
      );
    }
  }

  async getFirstMessage(conversationInfo: ConversationEntity) {
    return await this.openAIService.getFirstMessage(conversationInfo);
  }

  async saveMessage(
    conversationId: number,
    messageText: string,
    role: MessageRole,
  ) {
    return await this.messageRepository.save({
      conversationId,
      messageText,
      role,
    });
  }

  async getAndProcessConversationFromAudio(
    conversationId: number,
    audio: Express.Multer.File,
  ) {
    try {
      const userText = await this.openAIService.getTextFromAudio(audio);

      const userMessage = await this.saveMessage(
        conversationId,
        userText,
        MessageRole.USER,
      );

      const aiResponse = await this.processAudioResponse(conversationId, audio);

      const assistantMessage = await this.saveMessage(
        conversationId,
        aiResponse.text,
        MessageRole.ASSISTANT,
      );

      const updatedMissions = await this.updateMissionStatus(
        conversationId,
        aiResponse.missionResults,
      );

      return {
        userMessage,
        assistantMessage,
        missions: updatedMissions,
      };
    } catch (error) {
      throw new Error('대화 처리 중 오류가 발생했습니다: ' + error.message);
    }
  }

  async getAndProcessConversationFromText(
    conversationId: number,
    userText: string,
  ) {
    try {
      const userMessage = await this.saveMessage(
        conversationId,
        userText,
        MessageRole.USER,
      );

      const aiResponse = await this.processTextResponse(
        conversationId,
        userText,
      );

      const assistantMessage = await this.saveMessage(
        conversationId,
        aiResponse.text,
        MessageRole.ASSISTANT,
      );

      const updatedMissions = await this.updateMissionStatus(
        conversationId,
        aiResponse.missionResults,
      );

      return {
        userMessage,
        assistantMessage,
        missions: updatedMissions,
      };
    } catch (error) {
      throw new Error('대화 처리 중 오류가 발생했습니다: ' + error.message);
    }
  }

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
          throw new Error(
            `미션 ID ${missionResult.missionId}를 찾을 수 없습니다.`,
          );
        }

        mission.isCompleted = missionResult.isCompleted;
        return this.missionRepository.save(mission);
      });

      await Promise.all(updatePromises);

      return await this.missionRepository.findBy({ conversationId });
    } catch (error) {
      throw new Error(
        '미션 상태 업데이트 중 오류가 발생했습니다: ' + error.message,
      );
    }
  }
}
