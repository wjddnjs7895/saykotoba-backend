import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { MessageEntity } from '../../domain/conversation/entities/message.entity';
import {
  GenerateScenarioRequestDto,
  GenerateScenarioResponseDto,
} from '../../domain/conversation/dtos/generate-scenario';
import { ConversationScenarioTool } from './tools/conversation-scenario.tool';
import { ConversationEntity } from '../../domain/conversation/entities/conversation.entity';
import { PROMPTS } from './prompts';
import { ConversationResponseTool } from './tools/conversation-response.tool';
import { DIFFICULTY_MAP } from './constants';
import { GetFirstMessageDto } from './dtos/get-first-message.dto';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPEN_AI_API_KEY'),
      project: this.configService.get<string>('OPEN_AI_PROJECT_ID'),
    });
  }

  async generateScenario(
    generateScenarioDto: GenerateScenarioRequestDto,
  ): Promise<GenerateScenarioResponseDto> {
    const difficultyLevel = DIFFICULTY_MAP[generateScenarioDto.difficulty];
    const language = 'en';

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: PROMPTS.SCENARIO_CREATOR,
        },
        {
          role: 'user',
          content: `Please create a ${difficultyLevel} level conversation scenario about ${generateScenarioDto.topic}. 
          The situations should be specific and realistic, and the missions should be clear and achievable for learners.
          Available difficulty levels are: ${Object.values(DIFFICULTY_MAP).join(', ')}.
          In this scenario:
          - You (AI) will play the role of: ${generateScenarioDto.aiRole}
          - The user will play the role of: ${generateScenarioDto.userRole}
          
          Please include these exact values in your response:
          - difficulty: "${generateScenarioDto.difficulty}"
          - aiRole: "${generateScenarioDto.aiRole}"
          - userRole: "${generateScenarioDto.userRole}"
          - language: "${language}"`,
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

  async processAudioAndGenerateResponse(
    conversationInfo: ConversationEntity,
    messages: MessageEntity[],
    audio: Express.Multer.File,
  ): Promise<{ response: string; missionResults: any }> {
    const base64message = audio.buffer.toString('base64');

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-audio-preview',
      modalities: ['text'],
      messages: [
        {
          role: 'system',
          content: PROMPTS.CONVERSATION_PARTNER(
            conversationInfo.situation,
            conversationInfo.missions,
            DIFFICULTY_MAP[conversationInfo.difficulty],
          ),
        },
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
      tools: ConversationResponseTool,
      tool_choice: 'required',
    });

    const toolCall = response.choices[0].message.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No tool response received');
    }
    const result = JSON.parse(toolCall.function.arguments);
    Logger.log(
      PROMPTS.CONVERSATION_PARTNER(
        conversationInfo.situation,
        conversationInfo.missions,
        DIFFICULTY_MAP[conversationInfo.difficulty],
      ),
    );
    return {
      response: result.response,
      missionResults: result.missionResults,
    };
  }

  async processTextAndGenerateResponse(
    conversationInfo: ConversationEntity,
    messages: MessageEntity[],
    userText: string,
  ): Promise<{ response: string; missionResults: any }> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: PROMPTS.CONVERSATION_PARTNER(
            conversationInfo.situation,
            conversationInfo.missions,
            DIFFICULTY_MAP[conversationInfo.difficulty],
          ),
        },
        ...messages.map((message) => ({
          role: message.role,
          content: message.messageText,
        })),
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: userText,
            },
          ],
        },
      ],
      tools: ConversationResponseTool,
      tool_choice: 'required',
    });

    const toolCall = response.choices[0].message.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No tool response received');
    }
    const result = JSON.parse(toolCall.function.arguments);
    Logger.log(
      PROMPTS.CONVERSATION_PARTNER(
        conversationInfo.situation,
        conversationInfo.missions,
        DIFFICULTY_MAP[conversationInfo.difficulty],
      ),
    );
    return {
      response: result.response,
      missionResults: result.missionResults,
    };
  }

  async getAudioFromText(text: string): Promise<Buffer> {
    const response = await this.openai.audio.speech.create({
      model: 'tts-1-hd',
      voice: 'shimmer',
      input: text,
    });
    const buffer = Buffer.from(await response.arrayBuffer());
    return buffer;
  }

  async getTextFromAudio(audio: Express.Multer.File): Promise<string> {
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

  async getFirstMessage(
    getFirstMessageDto: GetFirstMessageDto,
  ): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: PROMPTS.FIRST_MESSAGE(
            getFirstMessageDto.situation,
            getFirstMessageDto.missions,
            DIFFICULTY_MAP[getFirstMessageDto.difficulty],
            getFirstMessageDto.aiRole,
            getFirstMessageDto.userRole,
          ),
        },
      ],
    });

    return response.choices[0].message.content;
  }
}
