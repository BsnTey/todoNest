import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../common';
import { Roles } from '../../decorators';
import { RequestWithUser } from '../types/auth.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const accessRoles = this.reflector.get<UserRole[]>(
      Roles,
      context.getHandler() || context.getClass(),
    );

    if (!accessRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest<RequestWithUser>();

    if (!accessRoles.includes(user.role))
      throw new ForbiddenException('Нет прав для доступа');
    return true;
  }
}
