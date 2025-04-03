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
import { ConversationService } from './services/conversation.service';
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
import {
  GetAudioFromTextRequestDto,
  GetAudioFromTextResponseDto,
} from './dtos/get-audio-from-text.dto';
import { GenerateFeedbackResponseDto } from './dtos/generate-feedback.dto';
import {
  CreateConversationGroupRequestDto,
  CreateConversationGroupResponseDto,
} from './dtos/create-conversation-group.dto';
import { ConversationGroupService } from './services/conversation-group.service';
import { GetUserConversationGroupResponseDto } from './dtos/get-user-conversation-group.dto';
import { GetLectureGroupResponseDto } from './dtos/get-user-lecture-group.dto';
import { GetConversationGroupInfoResponseDto } from './dtos/get-conversation-group-info.dto';
import { GenerateHintResponseDto } from './dtos/generate-hint.dto';
import { RequireSubscription } from '@/common/decorators/subscription.decorator';
import { LogParams } from '@/common/decorators/log-params.decorator';
@Controller('conversation')
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly conversationGroupService: ConversationGroupService,
  ) {}

  @Get('my-conversation-list')
  @LogParams()
  async getMyConversationList(
    @User() user: UserEntity,
  ): Promise<GetConversationListResponseDto[]> {
    return this.conversationService.getConversationsByUserId(user.id);
  }

  @RequireSubscription()
  @Post('audio-response')
  @UseInterceptors(FileInterceptor('audio'))
  @LogParams()
  async getResponseFromAudio(
    @UploadedFile() audio: Express.Multer.File,
    @User() user: UserEntity,
    @Body() body: { conversationId: string; speakingRate: string },
  ): Promise<ChatResponseDto> {
    return this.conversationService.getAndProcessConversationFromAudio({
      conversationId: parseInt(body.conversationId, 10),
      speakingRate: parseFloat(body.speakingRate),
      audio,
      userId: user.id,
    });
  }

  @Post('generate-scenario')
  @LogParams()
  async generateScenario(
    @Body() generateScenarioDto: GenerateScenarioRequestDto,
  ): Promise<GenerateScenarioResponseDto> {
    return this.conversationService.generateScenario(generateScenarioDto);
  }

  @Post('create')
  @LogParams()
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
  @LogParams()
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
  @LogParams()
  async getConversationInfo(
    @Param('conversationId') conversationId: number,
  ): Promise<GetConversationInfoResponseDto> {
    return this.conversationService.getConversationInfo(conversationId);
  }

  @Post('audio-from-text')
  @LogParams()
  async getAudioFromText(
    @Body() textToSpeechDto: GetAudioFromTextRequestDto,
  ): Promise<GetAudioFromTextResponseDto> {
    return this.conversationService.getAudioFromText(textToSpeechDto);
  }

  @Post('feedback')
  @LogParams()
  async generateFeedback(
    @Body() body: { conversationId: number },
  ): Promise<GenerateFeedbackResponseDto> {
    return this.conversationService.generateFeedBackAndSave(
      body.conversationId,
    );
  }

  @Post('hint/:conversationId')
  @LogParams()
  async generateHint(
    @Param('conversationId') conversationId: number,
  ): Promise<GenerateHintResponseDto> {
    return this.conversationService.generateHintAndCount(conversationId);
  }

  @Delete('undo/:conversationId')
  @LogParams()
  async undoMission(
    @Param('conversationId') conversationId: number,
  ): Promise<boolean> {
    return this.conversationService.undoChat(conversationId);
  }

  @Post('group')
  @LogParams()
  async createConversationGroup(
    @Body() createConversationGroupDto: CreateConversationGroupRequestDto,
  ): Promise<CreateConversationGroupResponseDto> {
    return this.conversationGroupService.createConversationGroup(
      createConversationGroupDto,
    );
  }

  @Get('group/all')
  @LogParams()
  async getConversationGroup(
    @User() user: UserEntity,
  ): Promise<GetUserConversationGroupResponseDto[]> {
    return this.conversationGroupService.getUserConversationGroups(user.id);
  }

  @Get('group/:groupId')
  @LogParams()
  async getConversationGroupInfo(
    @Param('groupId') groupId: number,
  ): Promise<GetConversationGroupInfoResponseDto> {
    return this.conversationGroupService.getUserConversationGroupInfo(groupId);
  }

  @Get('lecture-group')
  @LogParams()
  async getUserLectureGroup(
    @User() user: UserEntity,
  ): Promise<GetLectureGroupResponseDto[]> {
    return this.conversationGroupService.getUserLectureGroups(user.id);
  }

  @Post('reset/:conversationId')
  @LogParams()
  async resetConversation(
    @Param('conversationId') conversationId: number,
  ): Promise<{ conversationId: number }> {
    return this.conversationService.resetConversation(conversationId);
  }

  @Get('lesson/:lessonId')
  @LogParams()
  async getConversationIdByLessonId(
    @Param('lessonId') lessonId: number,
    @User() user: UserEntity,
  ): Promise<{ conversationId: number }> {
    return this.conversationService.findConversationIdByLessonId(
      user.id,
      lessonId,
    );
  }
}
