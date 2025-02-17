import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity, MessageRole } from '../entities/message.entity';
import { OpenAIService } from '../../../integrations/openai/openai.service';
import {
  GenerateScenarioRequestDto,
  GenerateScenarioResponseDto,
} from '../dtos/generate-scenario';
import { ConversationEntity } from '../entities/conversation.entity';
import {
  CreateConversationResponseDto,
  CreateConversationServiceDto,
} from '../dtos/create-conversation.dto';
import { MissionEntity } from '../entities/mission.entity';
import { MissionResultType } from '../../../integrations/openai/tools/conversation-response.tool';
import { GetConversationListResponseDto } from '../dtos/get-conversation-list.dto';
import { GetConversationInfoResponseDto } from '../dtos/get-conversation-info.dto';
import { ChatResponseDto } from '../dtos/chat-response.dto';
import {
  AudioGenerationFailedException,
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
import {
  CONVERSATION_TYPE,
  DIFFICULTY_MAP,
  EXP_PER_CONVERSATION,
  HINT_COUNT,
  SCORE_THRESHOLD,
} from '@/common/constants/conversation.constants';
import {
  GetAudioFromTextRequestDto,
  GetAudioFromTextResponseDto,
} from '../dtos/get-audio-from-text.dto';
import { GetFirstMessageResponseDto } from '@/integrations/openai/dtos/get-first-message.dto';
import { FeedbackEntity } from '../entities/feedback.entity';
import { UserService } from '../../user/services/user.service';
import { GoogleTTSService } from '@/integrations/google/services/google-tts.service';
import { CharacterService } from '@/domain/character/character.service';
import { S3Service } from '@/integrations/aws/services/s3/s3.service';
import { GenerateHintResponseDto } from '../dtos/generate-hint.dto';

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
    private readonly googleTTSService: GoogleTTSService,
    private readonly userService: UserService,
    private readonly characterService: CharacterService,
    private readonly s3Service: S3Service,
  ) {}

  async getConversationsByUserId(
    userId: number,
  ): Promise<GetConversationListResponseDto[]> {
    const conversations = await this.conversationRepository.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
    });

    if (!conversations || conversations.length === 0) {
      return [];
    }

    return conversations.map((conversation) => ({
      conversationId: conversation.id,
      title: conversation.title,
      difficultyLevel: conversation.difficultyLevel,
      thumbnailUrl: this.s3Service.getCloudFrontUrl(conversation.thumbnailUrl),
      type: conversation.type,
      isCompleted: conversation.isCompleted,
      score: conversation.score,
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
    const characteristic = await this.characterService.getCharacteristicByName({
      name: generateScenarioDto.userRole,
    });
    const scenario = await this.openAIService.generateScenario(
      generateScenarioDto,
      characteristic,
    );
    return {
      ...scenario,
      exp: EXP_PER_CONVERSATION[generateScenarioDto.difficultyLevel],
    };
  }

  async getConversationInfo(
    conversationId: number,
  ): Promise<GetConversationInfoResponseDto> {
    const conversationInfo = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['missions', 'feedback'],
      order: {
        missions: {
          id: 'ASC',
        },
      },
    });

    if (!conversationInfo) {
      throw new ConversationNotFoundException();
    }

    const response = {
      ...conversationInfo,
      thumbnailUrl: this.s3Service.getCloudFrontUrl(
        conversationInfo.thumbnailUrl,
      ),
    };
    return response;
  }

  async createConversation(
    createConversationDto: CreateConversationServiceDto,
  ): Promise<CreateConversationResponseDto> {
    try {
      const hintCount =
        DIFFICULTY_MAP.CHALLENGE - createConversationDto.difficultyLevel + 3;
      const characteristic =
        await this.characterService.getCharacteristicByName({
          name: createConversationDto.userRole,
        });
      const newConversation = this.conversationRepository.create({
        userId: createConversationDto.userId,
        title: createConversationDto.title,
        difficultyLevel: createConversationDto.difficultyLevel,
        situation: createConversationDto.situation,
        aiRole: createConversationDto.aiRole,
        userRole: createConversationDto.userRole,
        remainingHintCount: hintCount,
        exp:
          createConversationDto.exp ||
          EXP_PER_CONVERSATION[createConversationDto.difficultyLevel],
        problemId: createConversationDto.problemId,
        type: createConversationDto.type || CONVERSATION_TYPE.CUSTOM,
        thumbnailUrl: createConversationDto.thumbnailUrl,
        characteristic: characteristic,
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

      const firstMessage = await this.getFirstMessage(
        createConversationDto,
        characteristic,
      );
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
    characteristic: string,
  ): Promise<GetFirstMessageResponseDto> {
    return await this.openAIService.getFirstMessage({
      title: conversationInfo.title,
      situation: conversationInfo.situation,
      aiRole: conversationInfo.aiRole,
      userRole: conversationInfo.userRole,
      difficultyLevel: conversationInfo.difficultyLevel,
      missions: conversationInfo.missions,
      characteristic,
    });
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
        await this.conversationRepository.update(conversationId, {
          updatedAt: new Date(),
        });
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

      try {
        const updatedMissions = await this.updateMissionStatus(
          conversationId,
          aiResponse.missionResults,
        );

        response.missions = updatedMissions;
      } catch {
        throw new MissionSaveFailedException();
      }

      try {
        const { audioUrl } = await this.getAudioFromText({
          text: aiResponse.text,
          speakingRate,
        });
        response.audioUrl = audioUrl;
      } catch {
        throw new AudioGenerationFailedException();
      }
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
      const isSolved = await this.userService.isSolvedConversation({
        userId: conversationInfo.userId,
        conversationId: conversationInfo.id,
      });

      if (feedback.score >= SCORE_THRESHOLD.PASS && !isSolved) {
        await this.userService.updateUserExpAndCount({
          userId: conversationInfo.userId,
          exp: conversationInfo.exp,
        });
      }

      await this.userService.addSolvedIds({
        userId: conversationInfo.userId,
        conversationId: conversationInfo.id,
        problemId: conversationInfo.problemId,
      });
      return feedback;
    } catch (error) {
      if (error instanceof CustomBaseException) {
        throw error;
      }
      throw new UnexpectedException();
    }
  }

  async generateHintAndCount(
    conversationId: number,
  ): Promise<GenerateHintResponseDto> {
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
    const audio = await this.googleTTSService.getAudioFromText(textToSpeechDto);
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

  async resetConversation(
    conversationId: number,
  ): Promise<{ conversationId: number }> {
    const conversationInfo = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });
    if (!conversationInfo) {
      throw new ConversationNotFoundException();
    }
    try {
      await this.conversationRepository.update(conversationId, {
        remainingHintCount: HINT_COUNT[conversationInfo.difficultyLevel],
        isCompleted: false,
        score: 0,
      });
    } catch {
      throw new ConversationUpdateFailedException();
    }
    try {
      const messages = await this.messageRepository.find({
        where: { conversationId },
        order: { createdAt: 'ASC' },
      });
      if (messages.length > 1) {
        const messageIdsToDelete = messages.slice(1).map((msg) => msg.id);
        await this.messageRepository.delete(messageIdsToDelete);
      }
    } catch {
      throw new MessageDeleteFailedException();
    }
    try {
      await this.missionRepository.update(
        { conversationId },
        { isCompleted: false },
      );
    } catch {
      throw new MissionSaveFailedException();
    }
    try {
      await this.feedbackRepository.delete({ conversationId });
    } catch {
      throw new FeedbackSaveFailedException();
    }
    return {
      conversationId,
    };
  }

  async updateConversationGroup(conversationId: number, groupId: number) {
    return this.conversationRepository.update(
      { id: conversationId },
      { group: { id: groupId } },
    );
  }
}
