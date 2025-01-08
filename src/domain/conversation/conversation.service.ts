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
import { ChatResponseDto } from './dtos/chat-response.dto';
import {
  ConversationNotFoundException,
  ConversationSaveFailedException,
  ConversationUpdateFailedException,
  FeedbackSaveFailedException,
  HintCountExceededException,
  MessageDeleteFailedException,
  MessageNotFoundException,
  MessageSaveFailedException,
  MissionNotCompletedException,
  MissionNotFoundException,
  MissionSaveFailedException,
} from '@/common/exception/custom-exception/conversation.exception';
import { CustomBaseException } from '@/common/exception/custom.base.exception';
import { UnexpectedException } from '@/common/exception/custom-exception/unexpected.exception';
import { DIFFICULTY_MAP } from '@/common/constants/conversation.constants';
import { GetHintResponseDto } from './dtos/get-hint.dto';
import {
  GetAudioFromTextRequestDto,
  GetAudioFromTextResponseDto,
} from './dtos/get-audio-from-text.dto';
import { GetFirstMessageResponseDto } from '@/integrations/openai/dtos/get-first-message.dto';
import { GoogleService } from '@/integrations/google/google.service';
import { FeedbackEntity } from './entities/feedback.entity';
@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(MissionEntity)
    private readonly missionRepository: Repository<MissionEntity>,
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
    @InjectRepository(FeedbackEntity)
    private readonly feedbackRepository: Repository<FeedbackEntity>,
    private readonly openAIService: OpenAIService,
    private readonly s3Service: S3Service,
    private readonly googleService: GoogleService,
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

    const { response, meaning, missionResults } =
      await this.openAIService.processAudioAndGenerateResponse(
        conversationInfo,
        messages,
        audio,
      );

    return {
      text: response,
      meaning,
      missionResults,
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
      relations: ['missions', 'feedback'],
    });

    if (!conversationInfo) {
      throw new ConversationNotFoundException();
    }

    const response = conversationInfo;
    return response;
  }

  async createConversation(
    createConversationDto: CreateConversationServiceDto,
  ): Promise<CreateConversationResponseDto> {
    try {
      const hintCount =
        DIFFICULTY_MAP.CHALLENGE - createConversationDto.difficultyLevel;
      const newConversation = this.conversationRepository.create({
        userId: createConversationDto.userId,
        title: createConversationDto.title,
        difficultyLevel: createConversationDto.difficultyLevel,
        situation: createConversationDto.situation,
        aiRole: createConversationDto.aiRole,
        userRole: createConversationDto.userRole,
        remainingHintCount: hintCount,
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
          messageText: firstMessage.response,
          meaning: firstMessage.meaning,
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
  ): Promise<GetFirstMessageResponseDto> {
    return await this.openAIService.getFirstMessage(conversationInfo);
  }

  async getAndProcessConversationFromAudio(
    conversationId: number,
    speakingRate: number,
    audio: Express.Multer.File,
  ): Promise<ChatResponseDto> {
    try {
      const response = new ChatResponseDto();
      const userText = await this.openAIService.getTextFromAudio(audio);

      try {
        const userMessage = await this.messageRepository.save({
          conversationId,
          messageText: userText,
          role: MessageRole.USER,
        });
        response.userMessage = {
          id: userMessage.id,
          message: userMessage.messageText,
          isUser: true,
          createdAt: userMessage.createdAt,
        };
      } catch {
        throw new MessageSaveFailedException();
      }

      const aiResponse = await this.processAudioResponse(conversationId, audio);

      try {
        const assistantMessage = await this.messageRepository.save({
          conversationId,
          messageText: aiResponse.text,
          meaning: aiResponse.meaning,
          role: MessageRole.ASSISTANT,
        });
        response.assistantMessage = {
          id: assistantMessage.id,
          message: assistantMessage.messageText,
          meaning: aiResponse.meaning,
          isUser: false,
          createdAt: assistantMessage.createdAt,
        };
      } catch {
        throw new MessageSaveFailedException();
      }

      const updatedMissions = await this.updateMissionStatus(
        conversationId,
        aiResponse.missionResults,
      );

      response.missions = updatedMissions;

      const { audioUrl } = await this.getAudioFromText({
        text: aiResponse.text,
        speakingRate,
      });
      response.audioUrl = audioUrl;
      return response;
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

  async generateFeedBackAndSave(conversationId: number) {
    try {
      const language = 'en';
      const conversationInfo = await this.conversationRepository.findOne({
        where: { id: conversationId },
        relations: ['messages', 'missions'],
      });
      if (!conversationInfo) {
        throw new ConversationNotFoundException();
      }
      if (!conversationInfo.missions.every((mission) => mission.isCompleted)) {
        throw new MissionNotCompletedException();
      }
      const feedback = await this.openAIService.generateFeedBack({
        messages: conversationInfo.messages,
        difficulty: conversationInfo.difficultyLevel,
        language,
      });
      try {
        await this.feedbackRepository.save({
          conversationId: conversationId,
          betterExpressions: feedback.betterExpressions,
          difficultWords: feedback.difficultWords,
        });
      } catch {
        throw new FeedbackSaveFailedException();
      }
      try {
        await this.conversationRepository.update(conversationId, {
          isCompleted: true,
          score: feedback.score,
        });
      } catch {
        throw new ConversationUpdateFailedException();
      }
      return feedback;
    } catch (error) {
      if (error instanceof CustomBaseException) {
        throw error;
      }
      throw new UnexpectedException();
    }
  }

  async getHintAndCount(conversationId: number): Promise<GetHintResponseDto> {
    try {
      const language = 'en';
      const conversationInfo = await this.conversationRepository.findOne({
        where: { id: conversationId },
        relations: ['messages'],
      });
      if (!conversationInfo) {
        throw new ConversationNotFoundException();
      }

      if (conversationInfo.remainingHintCount === 0) {
        throw new HintCountExceededException();
      }
      const aiResult = await this.openAIService.generateHint({
        messages: conversationInfo.messages,
        difficultyLevel: conversationInfo.difficultyLevel,
        language,
      });

      const remainingHintCount = conversationInfo.remainingHintCount - 1;
      await this.conversationRepository.update(conversationId, {
        remainingHintCount: remainingHintCount,
      });

      return {
        hints: aiResult.hints,
        remainingHintCount: remainingHintCount,
      };
    } catch (error) {
      if (error instanceof CustomBaseException) {
        throw error;
      }
      throw new UnexpectedException();
    }
  }

  async getAudioFromText(
    textToSpeechDto: GetAudioFromTextRequestDto,
  ): Promise<GetAudioFromTextResponseDto> {
    const audio = await this.googleService.getAudioFromText(textToSpeechDto);
    const base64Audio = audio.toString('base64');
    return { audioUrl: `data:audio/mp3;base64,${base64Audio}` };
  }

  async undoChat(conversationId: number): Promise<boolean> {
    const messages = await this.messageRepository.find({
      where: { conversationId },
      order: { createdAt: 'ASC' },
    });

    if (messages.length === 0) {
      throw new MessageNotFoundException();
    }

    try {
      const lastMessage = messages[messages.length - 1];
      const secondLastMessage = messages[messages.length - 2];
      if (
        lastMessage.role === MessageRole.ASSISTANT &&
        secondLastMessage?.role === MessageRole.USER
      ) {
        await this.messageRepository.delete([
          lastMessage.id,
          secondLastMessage.id,
        ]);
      } else {
        await this.messageRepository.delete(lastMessage.id);
      }
      return true;
    } catch {
      throw new MessageDeleteFailedException();
    }
  }
}
