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
import { User } from '@common/decorators/user.decorator';
import { GetConversationListResponseDto } from './dtos/get-conversation-list.dto';
import { UserEntity } from '../users/entities/user.entity';
import { GetConversationInfoResponseDto } from './dtos/get-conversation-info.dto';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get('my-conversation-list')
  async getMyConversationList(
    @User() user: UserEntity,
  ): Promise<GetConversationListResponseDto[]> {
    return this.conversationService.getConversationsByUserId(user.id);
  }

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
    @User() user: UserEntity,
    @Body() createConversationDto: CreateConversationRequestDto,
  ): Promise<CreateConversationResponseDto> {
    const response = await this.conversationService.createConversation({
      ...createConversationDto,
      userId: user.id,
    });
    return response;
  }

  @Get('conversation-message')
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

  @Get('conversation-info/:conversationId')
  async getConversationInfo(
    @Param('conversationId') conversationId: number,
  ): Promise<GetConversationInfoResponseDto> {
    return this.conversationService.getConversationInfo(conversationId);
  }
}
