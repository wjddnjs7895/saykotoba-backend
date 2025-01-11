import { ConfigService } from '@nestjs/config';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { Injectable } from '@nestjs/common';
import { GoogleTTSFailedException } from '@/common/exception/custom-exception/google.exception';
import { TextToSpeechRequestDto } from '../dtos/text-to-speech.dto';

@Injectable()
export class GoogleTTSService {
  private ttsClient: TextToSpeechClient;
  constructor(private readonly configService: ConfigService) {
    this.ttsClient = new TextToSpeechClient({
      credentials: {
        private_key: this.configService.get<string>('GOOGLE_TTS_API_KEY'),
        client_email: this.configService.get<string>('GOOGLE_TTS_CLIENT_EMAIL'),
      },
    });
  }

  async getAudioFromText(
    textToSpeechDto: TextToSpeechRequestDto,
  ): Promise<Buffer> {
    try {
      const request = {
        input: { text: textToSpeechDto.text },
        voice: { languageCode: 'ja-JP', name: 'ja-JP-Wavenet-A' },
        audioConfig: {
          audioEncoding: 'MP3' as const,
          sampleRateHertz: 24000,
          speakingRate: textToSpeechDto.speakingRate ?? 1.0,
        },
      };
      const [response] = await this.ttsClient.synthesizeSpeech(request);
      if (!response.audioContent) {
        throw new GoogleTTSFailedException();
      }
      const audioBuffer = response.audioContent as Buffer;

      return audioBuffer;
    } catch {
      throw new GoogleTTSFailedException();
    }
  }
}
