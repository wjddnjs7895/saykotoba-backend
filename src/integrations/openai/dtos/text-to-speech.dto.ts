import { IsOptional, IsString } from 'class-validator';

export class TextToSpeechDto {
  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' = 'shimmer';
}
