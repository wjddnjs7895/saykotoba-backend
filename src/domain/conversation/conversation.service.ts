import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity, MessageRole } from './entities/message.entity';
import { OpenAIService } from '../openai/openai.service';
import {
  GetScenarioRequestDto,
  GetScenarioResponseDto,
} from './dtos/get-scenario.dto';
import { ConversationEntity } from './entities/conversation.entity';
import {
  CreateConversationRequestDto,
  CreateConversationResponseDto,
} from './dtos/create-conversation.dto';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    private readonly openAIService: OpenAIService,
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
  ) {}

  async getAllMessage(conversationId: number) {
    return await this.messageRepository.findBy({ conversationId });
  }

  async getResponse(conversationId: number, audio: Express.Multer.File) {
    const messages = await this.getAllMessage(conversationId);
    const response = await this.openAIService.getResponseByAudio(
      messages,
      audio,
    );
    return {
      text: response,
      audio: this.openAIService.getAudioByText(response),
    };
  }

  async getScenario(
    getScenarioDto: GetScenarioRequestDto,
  ): Promise<GetScenarioResponseDto> {
    return this.openAIService.getScenario(getScenarioDto);
  }

  async createConversation(
    createConversationDto: CreateConversationRequestDto,
  ): Promise<CreateConversationResponseDto> {
    const newConversation = this.conversationRepository.create(
      createConversationDto,
    );
    await this.conversationRepository.save(newConversation);
    return { conversationId: newConversation.id };
  }

  async saveMessage(
    conversationId: number,
    content: string,
    role: MessageRole,
  ) {
    return await this.messageRepository.save({
      conversationId,
      content,
      role,
    });
  }

  async processUserAudioAndGetResponse(
    conversationId: number,
    audio: Express.Multer.File,
  ) {
    try {
      const userText = await this.openAIService.getTextByAudio(audio);

      const userMessage = await this.saveMessage(
        conversationId,
        userText,
        MessageRole.USER,
      );

      const aiResponse = await this.getResponse(conversationId, audio);

      const assistantMessage = await this.saveMessage(
        conversationId,
        aiResponse.text,
        MessageRole.ASSISTANT,
      );

      return {
        userMessage,
        assistantMessage,
      };
    } catch (error) {
      throw new Error('대화 처리 중 오류가 발생했습니다: ' + error.message);
    }
  }
}
