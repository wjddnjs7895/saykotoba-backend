import { IsArray, IsNumber, IsString, Min, Max } from 'class-validator';

export class GenerateScenarioRequestDto {
  @IsNumber()
  @Min(0)
  @Max(5)
  difficultyLevel: number;

  @IsString()
  topic: string;

  @IsString()
  userRole: string;

  @IsString()
  aiRole: string;
}

export class GenerateScenarioResponseDto {
  @IsNumber()
  difficultyLevel: number;

  @IsString()
  title: string;

  @IsString()
  userRole: string;

  @IsString()
  aiRole: string;

  @IsString()
  scenario: string;

  @IsNumber()
  exp: number;

  @IsArray()
  @IsString({ each: true })
  missions: string[];
}
