import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guard';
import { TokensStrategy, UserRole } from '../common';

export const ROLES_KEY = 'roles';

export function Roles(
  roles: UserRole[],
  strategy: TokensStrategy = TokensStrategy.ACCESS_TOKEN,
) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(AuthGuard(strategy), RolesGuard),
  );
}
