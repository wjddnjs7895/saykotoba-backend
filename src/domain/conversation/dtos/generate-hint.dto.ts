import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class HintDto {
  @IsString()
  hint: string;

  @IsString()
  reading: string;

  @IsString()
  meaning: string;
}

export class GenerateHintResponseDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => HintDto)
  hints: HintDto[];

  @IsNumber()
  remainingHintCount: number;
}
