import { Injectable, Logger } from '@nestjs/common';
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
  CreateConversationRequestDto,
  CreateConversationResponseDto,
} from './dtos/create-conversation.dto';
import { MissionEntity } from './entities/mission.entity';
import { MissionResultType } from '../openai/tools/conversation-response.tool';

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

  async getAllMessage(conversationId: number) {
    return await this.messageRepository.findBy({ conversationId });
  }

  async processAudioResponse(
    conversationId: number,
    audio: Express.Multer.File,
  ) {
    const conversationInfo = await this.getConversationInfo(conversationId);
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

  async generateScenario(
    generateScenarioDto: GenerateScenarioRequestDto,
  ): Promise<GenerateScenarioResponseDto> {
    return this.openAIService.generateScenario(generateScenarioDto);
  }

  async getConversationInfo(conversationId: number) {
    const conversationInfo = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['missions'],
    });
    Logger.log('conversationInfo', JSON.stringify(conversationInfo));
    return conversationInfo;
  }

  async createConversation(
    createConversationDto: CreateConversationRequestDto,
  ): Promise<CreateConversationResponseDto> {
    try {
      // 대화 생성
      const newConversation = this.conversationRepository.create({
        userId: createConversationDto.userId,
        difficulty: createConversationDto.difficulty,
        situation: createConversationDto.situation,
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

  async getAndProcessConversation(
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
