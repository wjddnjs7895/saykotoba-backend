import { IsArray, IsNumber, IsString } from 'class-validator';

export class GetScenarioRequestDto {
  @IsNumber()
  difficulty: number;

  @IsString()
  topic: string;
}

export class GetScenarioResponseDto {
  @IsString()
  scenario: string;

  @IsArray()
  @IsString({ each: true })
  mission: string[];
}
