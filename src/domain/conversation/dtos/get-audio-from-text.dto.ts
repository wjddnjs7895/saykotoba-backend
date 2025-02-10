import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetAudioFromTextRequestDto {
  @IsString()
  text: string;

  @IsOptional()
  @IsNumber()
  speakingRate?: number;
}

export class GetAudioFromTextResponseDto {
  @IsString()
  audioUrl: string;
}
