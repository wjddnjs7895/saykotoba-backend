import { IsString, IsNotEmpty } from 'class-validator';

export abstract class CreateVocaBaseDto {
  @IsNotEmpty()
  @IsString()
  language: string;

  @IsString()
  @IsNotEmpty()
  word: string;

  @IsString()
  @IsNotEmpty()
  meaning: string;

  @IsString()
  @IsNotEmpty()
  example: string;

  @IsString()
  @IsNotEmpty()
  example_meaning: string;
}
