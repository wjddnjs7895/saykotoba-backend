import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  Param,
  Delete,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { OpenAIService } from '../../integrations/openai/openai.service';
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
import { User } from '@common/decorators/user.decorator';
import { GetConversationListResponseDto } from './dtos/get-conversation-list.dto';
import { UserEntity } from '../user/entities/user.entity';
import { GetConversationInfoResponseDto } from './dtos/get-conversation-info.dto';
import { ChatResponseDto } from './dtos/chat-response.dto';
import { GetHintResponseDto } from './dtos/get-hint.dto';
import {
  GetAudioFromTextRequestDto,
  GetAudioFromTextResponseDto,
} from './dtos/get-audio-from-text.dto';
import { GenerateFeedbackResponseDto } from './dtos/generate-feedback.dto';

@Controller('conversation')
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly openaiService: OpenAIService,
  ) {}

  @Get('my-conversation-list')
  async getMyConversationList(
    @User() user: UserEntity,
  ): Promise<GetConversationListResponseDto[]> {
    return this.conversationService.getConversationsByUserId(user.id);
  }

  @Post('audio-response')
  @UseInterceptors(FileInterceptor('audio'))
  async getResponseFromAudio(
    @UploadedFile() audio: Express.Multer.File,
    @Body() body: { conversationId: string; speakingRate: string },
  ): Promise<ChatResponseDto> {
    console.log(body);
    return this.conversationService.getAndProcessConversationFromAudio(
      parseInt(body.conversationId, 10),
      parseFloat(body.speakingRate),
      audio,
    );
  }

  // @Post('text-response')
  // async processTextMessage(
  //   @Body('conversationId') conversationId: number,
  //   @Body('userText') userText: string,
  // ) {
  //   return this.conversationService.getAndProcessConversationFromText(
  //     conversationId,
  //     userText,
  //   );
  // }

  @Post('generate-scenario')
  async generateScenario(
    @Body() generateScenarioDto: GenerateScenarioRequestDto,
  ): Promise<GenerateScenarioResponseDto> {
    return this.conversationService.generateScenario(generateScenarioDto);
  }

  @Post('create')
  async createConversation(
    @User() user: UserEntity,
    @Body() createConversationDto: CreateConversationRequestDto,
  ): Promise<CreateConversationResponseDto> {
    const response = await this.conversationService.createConversation({
      ...createConversationDto,
      userId: user.id,
    });
    return response;
  }

  @Get('conversation-message/:conversationId')
  async getAllMessage(
    @Param('conversationId') conversationId: number,
  ): Promise<GetConversationMessageResponseDto[]> {
    const messages =
      await this.conversationService.getAllMessage(conversationId);
    return messages.map((message) => ({
      id: message.id,
      message: message.messageText,
      meaning: message.meaning,
      isUser: message.role === 'user',
      createdAt: message.createdAt,
    }));
  }

  @Get('conversation-info/:conversationId')
  async getConversationInfo(
    @Param('conversationId') conversationId: number,
  ): Promise<GetConversationInfoResponseDto> {
    return this.conversationService.getConversationInfo(conversationId);
  }

  @Post('audio-from-text')
  async getAudioFromText(
    @Body() textToSpeechDto: GetAudioFromTextRequestDto,
  ): Promise<GetAudioFromTextResponseDto> {
    return this.conversationService.getAudioFromText(textToSpeechDto);
  }

  @Post('feedback')
  async generateFeedback(
    @Body() body: { conversationId: number },
  ): Promise<GenerateFeedbackResponseDto> {
    return this.conversationService.generateFeedBackAndSave(
      body.conversationId,
    );
  }

  @Get('hint/:conversationId')
  async getHint(
    @Param('conversationId') conversationId: number,
  ): Promise<GetHintResponseDto> {
    return this.conversationService.getHintAndCount(conversationId);
  }

  @Delete('undo/:conversationId')
  async undoMission(
    @Param('conversationId') conversationId: number,
  ): Promise<boolean> {
    return this.conversationService.undoChat(conversationId);
  }
}
