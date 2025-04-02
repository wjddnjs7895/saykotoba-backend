import { CreateVocaBaseDto } from './create-voca-base.dto';
import { IsNumber, IsNotEmpty, Min, Max, IsString } from 'class-validator';

export class CreateVocaJpDto extends CreateVocaBaseDto {
  @IsString()
  @IsNotEmpty()
  reading: string;

  @IsString()
  @IsNotEmpty()
  example_reading: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  difficulty: number;
}
