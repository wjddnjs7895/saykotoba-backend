import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class GetInterestResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  shortName: string;

  @IsString()
  interest: string;
}

export class GetInterestListResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GetInterestResponseDto)
  interests: GetInterestResponseDto[];
}
