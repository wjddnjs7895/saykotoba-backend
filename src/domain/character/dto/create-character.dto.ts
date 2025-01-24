import { CHARACTER_GENDER } from '@/common/constants/character.constants';
import { IsArray, IsEnum, IsString } from 'class-validator';

export class CreateCharacterRequestDto {
  @IsString()
  name: string;

  @IsEnum(CHARACTER_GENDER)
  gender: CHARACTER_GENDER;

  @IsString()
  job: string;

  @IsString()
  personality: string;

  @IsArray()
  characteristic: string[];

  @IsString()
  imageUrl: string;

  @IsString()
  description: string;
}

export class CreateCharacterResponseDto {
  @IsString()
  characterId: string;
}
