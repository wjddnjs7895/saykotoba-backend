import { Language } from '@/common/constants/app.constants';
import { IsString, IsEnum, IsArray } from 'class-validator';

export class UpdateUserOnboardingRequestDto {
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  topics: string[];

  @IsEnum(Language)
  language: Language;
}
