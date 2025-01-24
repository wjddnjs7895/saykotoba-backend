import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AdminGuard } from '@/domain/auth/guards/admin.guard';
import { UserRole } from '@/common/constants/user.constants';
import { AuthErrorMessage } from '../exception/error-constant/error.message';
import { AuthErrorCodeEnum } from '../exception/error-constant/error.code';

export const ADMIN_KEY = 'admin';
export const Admin = () => {
  return applyDecorators(
    SetMetadata(ADMIN_KEY, UserRole.ADMIN),
    UseGuards(AuthGuard('jwt'), AdminGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description: AuthErrorMessage[AuthErrorCodeEnum.AdminUnauthorized],
    }),
  );
};
