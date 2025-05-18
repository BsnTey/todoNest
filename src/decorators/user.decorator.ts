import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserContext } from '../auth/types/user.context.interface';

export const UserJWT = createParamDecorator(
  (data: UserContext, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if (!req.user) throw new ForbiddenException('Доступ запрещен');
    return req.user;
  },
);
