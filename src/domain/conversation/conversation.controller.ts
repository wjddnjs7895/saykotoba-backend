import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  GenerateScenarioRequestDto,
  GenerateScenarioResponseDto,
} from './dtos/generate-scenario';
import {
  CreateConversationRequestDto,
  CreateConversationResponseDto,
} from './dtos/create-conversation.dto';
import { GetConversationMessageResponseDto } from './dtos/get-conversation-message.dto';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post('audio-response')
  @UseInterceptors(FileInterceptor('audio'))
  async processAudioMessage(
    @Body('conversationId') conversationId: number,
    @UploadedFile() audio: Express.Multer.File,
  ) {
    console.log('audio', audio);
    return this.conversationService.getAndProcessConversationFromAudio(
      conversationId,
      audio,
    );
  }

  @Post('text-response')
  async processTextMessage(
    @Body('conversationId') conversationId: number,
    @Body('userText') userText: string,
  ) {
    return this.conversationService.getAndProcessConversationFromText(
      conversationId,
      userText,
    );
  }

  @Post('generate-scenario')
  async generateScenario(
    @Body() generateScenarioDto: GenerateScenarioRequestDto,
  ): Promise<GenerateScenarioResponseDto> {
    return this.conversationService.generateScenario(generateScenarioDto);
  }

  @Post('create')
  async createConversation(
    @Body() createConversationDto: CreateConversationRequestDto,
  ): Promise<CreateConversationResponseDto> {
    const response = await this.conversationService.createConversation(
      createConversationDto,
    );
    return response;
  }

  @Get('get-conversation-message')
  async getAllMessage(
    @Param('conversationId') conversationId: number,
  ): Promise<GetConversationMessageResponseDto[]> {
    const messages =
      await this.conversationService.getAllMessage(conversationId);
    return messages.map((message) => ({
      id: message.id,
      message: message.messageText,
      isUser: message.role === 'user',
      createdAt: message.createdAt,
    }));
  }
}
