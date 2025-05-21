import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { RequestWithUser } from '../auth/types/auth.interface';
import { User as UserModel } from '../entity/user.entity';

export const User = createParamDecorator(
  (data: UserModel, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>();
    if (!req.user) throw new ForbiddenException('Доступ запрещен');
    return req.user;
  },
);
