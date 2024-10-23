import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { FileInterceptor } from '@nestjs/platform-express';

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
}
