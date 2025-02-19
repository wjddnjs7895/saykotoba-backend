import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ADMIN_KEY } from '@/common/decorators/admin.decorator';
import { UserRole } from '@/common/constants/user.constants';
import { AdminUnauthorizedException } from '@/common/exception/custom-exception/auth.exception';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<UserRole>(
      ADMIN_KEY,
      context.getHandler(),
    );

    if (!requiredRole) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.role || user.role !== UserRole.ADMIN) {
      throw new AdminUnauthorizedException();
    }

    return true;
  }
}
