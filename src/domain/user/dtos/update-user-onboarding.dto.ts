import { Language } from '@/common/constants/app.constants';
import { IsString, IsEnum, IsArray, IsNumber } from 'class-validator';

export class UpdateUserOnboardingRequestDto {
  @IsString()
  name: string;

  @IsEnum(Language)
  language: Language;

  @IsNumber()
  difficultyLevel: number;

  @IsNumber()
  style: number;

  @IsArray()
  @IsNumber({}, { each: true })
  interestIds: number[];
}
