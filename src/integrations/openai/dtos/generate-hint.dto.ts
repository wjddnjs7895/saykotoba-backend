import { IsString } from 'class-validator';

export class GenerateHintsResponseDto {
  @IsString()
  japanese: string;

  @IsString()
  meaning: string;
}
