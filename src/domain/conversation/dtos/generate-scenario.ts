import { IsArray, IsNumber, IsString } from 'class-validator';

export class GenerateScenarioRequestDto {
  @IsNumber()
  difficulty: number;

  @IsString()
  topic: string;
}

export class GenerateScenarioResponseDto {
  @IsString()
  scenario: string;

  @IsArray()
  @IsString({ each: true })
  missions: string[];
}
