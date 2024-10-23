import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { MessageEntity } from '../conversation/entities/message.entity';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPEN_AI_API_KEY'),
      project: this.configService.get<string>('OPEN_AI_PROJECT_ID'),
    });
  }

  async getResponseByAudio(
    messages: MessageEntity[],
    audio: Express.Multer.File,
  ) {
    const base64message = audio.buffer.toString('base64');
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-audio-preview',
      modalities: ['text'],
      audio: { voice: 'alloy', format: 'wav' },
      messages: [
        ...messages.map((message) => ({
          role: message.role,
          content: message.message,
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

  async getAudioByText(text: string) {
    const response = await this.openai.audio.speech.create({
      model: 'tts-1-hd',
      voice: 'shimmer',
      input: text,
    });
    const buffer = Buffer.from(await response.arrayBuffer());
    return buffer;
  }
}
