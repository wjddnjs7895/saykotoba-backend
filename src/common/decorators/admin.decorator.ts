import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AdminGuard } from '@/domain/auth/guards/admin.guard';
import { UserRole } from '@/common/constants/user.constants';

export const ADMIN_KEY = 'admin';
export const Admin = () => {
  return applyDecorators(
    SetMetadata(ADMIN_KEY, UserRole.ADMIN),
    UseGuards(AuthGuard('jwt'), AdminGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: '관리자 권한이 없습니다.' }),
  );
};
