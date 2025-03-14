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
import {
  GetFirstMessageDto,
  GetFirstMessageResponseDto,
} from './dtos/get-first-message.dto';
import { GenerateResponseDto } from './dtos/generate-response.dto';
import {
  BufferToFileFailedException,
  NoToolResponseReceivedException,
  OpenAICreateFailedException,
} from '@/common/exception/custom-exception/openai.exception';
import { CustomBaseException } from '@/common/exception/custom.base.exception';
import { UnexpectedException } from '@/common/exception/custom-exception/unexpected.exception';
import { ConversationFeedbackTool } from './tools/conversation-feedback.tool';
import {
  AIFeedbackRequestDto,
  AIFeedbackResponseDto,
} from './dtos/generate-feedback.dto';
import { DIFFICULTY_MAP } from '@/common/constants/conversation.constants';
import {
  GenerateHintRequestDto,
  GenerateHintResponseDto,
} from './dtos/generate-hint.dto';
import { ConversationHintTool } from './tools/conversation-hint.tool';
import { ConversationFirstResponseTool } from './tools/conversation-first-response.tool';
import {
  GenerateClassroomRequestDto,
  GenerateClassroomResponseDto,
} from './dtos/generate-classroom.dto';
import { ClassroomTool } from './tools/classroom.tool';
import { convertM4AToWav } from '@/common/utils/audio.utils';

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
    characteristic: string,
  ): Promise<GenerateScenarioResponseDto> {
    const language = 'en';
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: PROMPTS.SCENARIO_CREATOR({
              difficulty: DIFFICULTY_MAP[generateScenarioDto.difficultyLevel],
              topic: generateScenarioDto.topic,
              aiRole: generateScenarioDto.aiRole,
              userRole: generateScenarioDto.userRole,
              characteristic: characteristic,
              language,
            }),
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
      throw new UnexpectedException(error.message);
    }
  }

  async processAudioAndGenerateResponse(
    conversationInfo: ConversationEntity,
    messages: MessageEntity[],
    audio: Express.Multer.File,
  ): Promise<GenerateResponseDto> {
    try {
      let audioBuffer = audio.buffer;
      if (
        audio.mimetype === 'audio/x-m4a' ||
        audio.originalname.endsWith('.m4a')
      ) {
        audioBuffer = await convertM4AToWav(audio.buffer);
      }

      const base64message = audioBuffer.toString('base64');

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini-audio-preview',
        modalities: ['text'],
        messages: [
          {
            role: 'system',
            content: PROMPTS.CONVERSATION_PARTNER({
              situation: conversationInfo.situation,
              missions: conversationInfo.missions,
              difficultyLevel: conversationInfo.difficultyLevel,
              aiRole: conversationInfo.aiRole,
              userRole: conversationInfo.userRole,
              characteristic: conversationInfo.characteristic,
            }),
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
        meaning: result.meaning,
        missionResults: result.missionResults,
      };
    } catch (error) {
      if (error instanceof CustomBaseException) {
        throw error;
      }
      throw new UnexpectedException(
        'openAI service process audio and generate response: ' + error.message,
      );
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

  async getTextFromAudio(audio: Express.Multer.File): Promise<string> {
    try {
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
    } catch (error) {
      if (error instanceof CustomBaseException) {
        throw error;
      }
      throw new UnexpectedException('get text from audio: ' + error.message);
    }
  }

  async getFirstMessage(
    getFirstMessageDto: GetFirstMessageDto,
  ): Promise<GetFirstMessageResponseDto> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: PROMPTS.FIRST_MESSAGE({
            situation: getFirstMessageDto.situation,
            missions: getFirstMessageDto.missions,
            difficultyLevel: getFirstMessageDto.difficultyLevel,
            aiRole: getFirstMessageDto.aiRole,
            userRole: getFirstMessageDto.userRole,
            characteristic: getFirstMessageDto.characteristic,
          }),
        },
      ],
      tools: ConversationFirstResponseTool,
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
      meaning: result.meaning,
    };
  }

  async generateFeedBack(
    generateFeedbackRequestDto: AIFeedbackRequestDto,
  ): Promise<AIFeedbackResponseDto> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: PROMPTS.FEEDBACK({
            messages: generateFeedbackRequestDto.messages,
            difficultyLevel: generateFeedbackRequestDto.difficulty,
            language: generateFeedbackRequestDto.language,
          }),
        },
      ],
      tools: ConversationFeedbackTool,
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
      score: result.score,
      betterExpressions: result.betterExpressions,
      difficultWords: result.difficultWords,
    };
  }

  async generateHint(
    generateHintRequestDto: GenerateHintRequestDto,
  ): Promise<GenerateHintResponseDto> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: PROMPTS.HINT_CREATOR({
            messages: generateHintRequestDto.messages,
            difficultyLevel: generateHintRequestDto.difficultyLevel,
            language: generateHintRequestDto.language,
          }),
        },
      ],
      tools: ConversationHintTool,
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

    return result;
  }

  async generateClassroom(
    generateClassroomRequestDto: GenerateClassroomRequestDto,
  ): Promise<GenerateClassroomResponseDto> {
    const lectureIds = generateClassroomRequestDto.lectures.map(
      (lecture) => lecture.id,
    );
    const prompt = PROMPTS.CLASSROOM_CREATOR({
      generateClassroomRequestDto,
      lectureIds,
    });

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: prompt,
        },
      ],
      tools: ClassroomTool,
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

    return result;
  }
}
