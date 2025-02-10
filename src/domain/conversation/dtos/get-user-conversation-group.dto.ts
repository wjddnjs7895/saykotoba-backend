import { IsNumber, IsString } from 'class-validator';

export class GetUserConversationGroupResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  thumbnailUrl: string;
}
