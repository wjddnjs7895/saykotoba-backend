import { IsNumber, IsOptional, IsString } from 'class-validator';

export class TextToSpeechRequestDto {
  @IsString()
  text: string;

  @IsNumber()
  @IsOptional()
  speakingRate?: number;
}
