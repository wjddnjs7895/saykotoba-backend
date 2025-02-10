import { IsString } from 'class-validator';
import { GetCharacterResponseDto } from './get-character.dto';

export class GetCharacterByNameRequestDto {
  @IsString()
  name: string;
}
export class GetCharacterByNameResponseDto extends GetCharacterResponseDto {}
