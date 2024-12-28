import { Injectable } from '@nestjs/common';
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
import { GenerateResponseDto } from './dtos/generate-response.dto';
import {
  BufferToFileFailedException,
  NoToolResponseReceivedException,
  OpenAICreateFailedException,
} from '@/common/exception/custom-exception/openai.exception';
import { CustomBaseException } from '@/common/exception/custom.base.exception';
import { UnexpectedException } from '@/common/exception/custom-exception/unexpected.exception';

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
    try {
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

      if (!response) {
        throw new OpenAICreateFailedException();
      }

      const toolCall = response.choices[0].message.tool_calls?.[0];
      if (!toolCall) {
        throw new NoToolResponseReceivedException();
      }

      return JSON.parse(toolCall.function.arguments);
    } catch (error) {
      if (error instanceof CustomBaseException) {
        throw error;
      }
      throw new UnexpectedException();
    }
  }

  async processAudioAndGenerateResponse(
    conversationInfo: ConversationEntity,
    messages: MessageEntity[],
    audio: Express.Multer.File,
  ): Promise<GenerateResponseDto> {
    const base64message = audio.buffer.toString('base64');

    try {
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

      if (!response) {
        throw new OpenAICreateFailedException();
      }

      const toolCall = response.choices[0].message.tool_calls?.[0];
      if (!toolCall) {
        throw new NoToolResponseReceivedException();
      }

      const result = JSON.parse(toolCall.function.arguments);

      return {
        response: result.response,
        missionResults: result.missionResults,
        suggestedReplies: result.suggestedReplies,
      };
    } catch (error) {
      if (error instanceof CustomBaseException) {
        throw error;
      }
      throw new UnexpectedException();
    }
  }

  // async processTextAndGenerateResponse(
  //   conversationInfo: ConversationEntity,
  //   messages: MessageEntity[],
  //   userText: string,
  // ): Promise<{ response: string; missionResults: any }> {
  //   const response = await this.openai.chat.completions.create({
  //     model: 'gpt-4o-mini',
  //     messages: [
  //       {
  //         role: 'system',
  //         content: PROMPTS.CONVERSATION_PARTNER(
  //           conversationInfo.situation,
  //           conversationInfo.missions,
  //           DIFFICULTY_MAP[conversationInfo.difficulty],
  //         ),
  //       },
  //       ...messages.map((message) => ({
  //         role: message.role,
  //         content: message.messageText,
  //       })),
  //       {
  //         role: 'user',
  //         content: [
  //           {
  //             type: 'text',
  //             text: userText,
  //           },
  //         ],
  //       },
  //     ],
  //     tools: ConversationResponseTool,
  //     tool_choice: 'required',
  //   });

  //   const toolCall = response.choices[0].message.tool_calls?.[0];
  //   if (!toolCall) {
  //     throw new Error('No tool response received');
  //   }
  //   const result = JSON.parse(toolCall.function.arguments);
  //   Logger.log(
  //     PROMPTS.CONVERSATION_PARTNER(
  //       conversationInfo.situation,
  //       conversationInfo.missions,
  //       DIFFICULTY_MAP[conversationInfo.difficulty],
  //     ),
  //   );
  //   return {
  //     response: result.response,
  //     missionResults: result.missionResults,
  //   };
  // }

  async getAudioFromText(text: string): Promise<Buffer> {
    try {
      const response = await this.openai.audio.speech.create({
        model: 'tts-1-hd',
        voice: 'shimmer',
        input: text,
      });
      if (!response) {
        throw new OpenAICreateFailedException();
      }
      const buffer = Buffer.from(await response.arrayBuffer());
      return buffer;
    } catch (error) {
      if (error instanceof CustomBaseException) {
        throw error;
      }
      throw new UnexpectedException();
    }
  }

  async getTextFromAudio(audio: Express.Multer.File): Promise<string> {
    const audioFile = new File([audio.buffer], audio.originalname, {
      type: audio.mimetype,
    });
    if (!audioFile) {
      throw new BufferToFileFailedException();
    }

    const response = await this.openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'ja',
      response_format: 'text',
    });

    if (!response) {
      throw new OpenAICreateFailedException();
    }

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

    if (!response) {
      throw new OpenAICreateFailedException();
    }

    return response.choices[0].message.content;
  }
}
