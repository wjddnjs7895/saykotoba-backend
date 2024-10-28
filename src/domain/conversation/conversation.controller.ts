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
  GetScenarioRequestDto,
  GetScenarioResponseDto,
} from './dtos/get-scenario.dto';
import {
  CreateConversationRequestDto,
  CreateConversationResponseDto,
} from './dtos/create-conversation.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post('response')
  @UseInterceptors(FileInterceptor('audio'))
  async getResponse(
    @Body('conversationId') conversationId: number,
    @UploadedFile() audio: Express.Multer.File,
  ) {
    return this.conversationService.getResponse(conversationId, audio);
  }

  @Post('scenario')
  async getScenario(
    @Body() getScenarioDto: GetScenarioRequestDto,
  ): Promise<GetScenarioResponseDto> {
    return this.conversationService.getScenario(getScenarioDto);
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
