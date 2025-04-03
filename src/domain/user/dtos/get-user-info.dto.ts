import { TIER_MAP } from '@/common/constants/user.constants';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsJSON,
  IsNumber,
  IsString,
} from 'class-validator';

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
  tier: TIER_MAP;

  @IsNumber()
  solvedConversationCount: number;

  @IsJSON()
  solvedProblemIds: number[];

  @IsJSON()
  solvedConversationIds: number[];

  @IsString()
  subscriptionStatus: string;

  @IsDate()
  expiresAt: Date;

  @IsNumber()
  freeTrialCount: number;
}
