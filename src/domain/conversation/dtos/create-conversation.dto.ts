import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateConversationRequestDto {
  @IsString()
  title: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  difficultyLevel: number;

  @IsString()
  situation: string;

  @IsArray()
  @IsString({ each: true })
  missions: string[];

  @IsString()
  aiRole: string;

  @IsString()
  userRole: string;

  @IsString()
  @IsOptional()
  thumbnailUrl?: string;
}

export interface CreateConversationServiceDto
  extends CreateConversationRequestDto {
  userId: number;
}

export class CreateConversationResponseDto {
  @IsNumber()
  conversationId: number;
}
