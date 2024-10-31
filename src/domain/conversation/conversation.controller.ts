import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
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
import { Public } from 'src/common/decorators/public.decorator';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Public()
  @Post('audio-response')
  @UseInterceptors(FileInterceptor('audio'))
  async processAudioMessage(
    @Body('conversationId') conversationId: number,
    @UploadedFile() audio: Express.Multer.File,
  ) {
    return this.conversationService.getAndProcessConversation(
      conversationId,
      audio,
    );
  }

  @Public()
  @Post('generate-scenario')
  async generateScenario(
    @Body() generateScenarioDto: GenerateScenarioRequestDto,
  ): Promise<GenerateScenarioResponseDto> {
    return this.conversationService.generateScenario(generateScenarioDto);
  }

  @Public()
  @Post('create')
  async createConversation(
    @Body() createConversationDto: CreateConversationRequestDto,
  ): Promise<CreateConversationResponseDto> {
    const response = await this.conversationService.createConversation(
      createConversationDto,
    );
    return response;
  }
}
