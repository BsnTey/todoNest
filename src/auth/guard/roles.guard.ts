import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../common';
import { ROLES_KEY } from '../../decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const accessRoles = this.reflector.get<UserRole[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    if (accessRoles.length === 0) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return accessRoles.includes(user.userRole);
  }
}
