import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity } from './entities/message.entity';
import { OpenAIService } from '../openai/openai.service';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    private readonly openAIService: OpenAIService,
  ) {}

  async getAllMessage(conversationId: number) {
    return await this.messageRepository.findBy({ conversationId });
  }

  async getResponse(conversationId: number, audio: Express.Multer.File) {
    const messages = await this.getAllMessage(conversationId);
    return this.openAIService.getResponseByAudio(messages, audio);
    // const response = await this.openAIService.getResponseByAudio(
    //   messages,
    //   audio,
    // );
    // return this.openAIService.getAudioByText(response);
  }
}
