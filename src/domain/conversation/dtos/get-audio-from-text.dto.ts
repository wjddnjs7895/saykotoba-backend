import { IsOptional, IsString } from 'class-validator';

export class GetAudioFromTextRequestDto {
  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' = 'shimmer';
}

export class GetAudioFromTextResponseDto {
  @IsString()
  audioUrl: string;
}
