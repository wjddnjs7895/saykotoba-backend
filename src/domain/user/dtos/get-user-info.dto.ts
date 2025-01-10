import { TIER_MAP } from '@/common/constants/user.constants';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsJSON, IsNumber, IsString } from 'class-validator';

export class GetUserInfoRespondDto {
  @IsNumber()
  userId: number;

  @IsBoolean()
  isOnboardingCompleted: boolean;

  @IsString()
  name: string;

  @IsNumber()
  exp: number;

  @IsEnum(TIER_MAP)
  @Type(() => String)
  tier: TIER_MAP;

  @IsNumber()
  solvedConversationCount: number;

  @IsJSON()
  solvedProblems: number[];

  @IsString()
  subscriptionStatus: string;
}
