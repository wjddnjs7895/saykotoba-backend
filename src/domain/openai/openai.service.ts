import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { MessageEntity } from '../conversation/entities/message.entity';
import {
  GetScenarioRequestDto,
  GetScenarioResponseDto,
} from '../conversation/dtos/get-scenario.dto';
import { ConversationScenarioTool } from './tools/conversation-scenario.tool';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPEN_AI_API_KEY'),
      project: this.configService.get<string>('OPEN_AI_PROJECT_ID'),
    });
  }

  async getScenario(
    getScenarioDto: GetScenarioRequestDto,
  ): Promise<GetScenarioResponseDto> {
    const difficultyMap = {
      1: 'beginner',
      2: 'intermediate',
      3: 'advanced',
    };

    const difficultyLevel =
      difficultyMap[getScenarioDto.difficulty] || 'intermediate';

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert in creating Japanese learning scenarios and missions.',
        },
        {
          role: 'user',
          content: `Please create a ${difficultyLevel} level conversation scenario about ${getScenarioDto.topic}. The situations should be specific and realistic, and the missions should be clear and achievable for learners.`,
        },
      ],
      tools: ConversationScenarioTool,
      tool_choice: 'required',
    });
    const toolCall = response.choices[0].message.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No tool response received');
    }
    return JSON.parse(toolCall.function.arguments);
  }

  async getResponseByAudio(
    messages: MessageEntity[],
    audio: Express.Multer.File,
  ): Promise<string> {
    const base64message = audio.buffer.toString('base64');
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-audio-preview',
      modalities: ['text'],
      audio: { voice: 'alloy', format: 'wav' },
      messages: [
        ...messages.map((message) => ({
          role: message.role,
          content: message.messageText,
        })),
        {
          role: 'user',
          content: [
            {
              type: 'input_audio',
              input_audio: {
                data: base64message,
                format: 'wav',
              },
            },
          ],
        },
      ],
    });
    return response.choices[0].message.content;
  }

  async getAudioByText(text: string): Promise<Buffer> {
    const response = await this.openai.audio.speech.create({
      model: 'tts-1-hd',
      voice: 'shimmer',
      input: text,
    });
    const buffer = Buffer.from(await response.arrayBuffer());
    return buffer;
  }

  async getTextByAudio(audio: Express.Multer.File): Promise<string> {
    const audioFile = new File([audio.buffer], audio.originalname, {
      type: audio.mimetype,
    });

    const response = await this.openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'ja',
      response_format: 'text',
    });

    return response;
  }
}
