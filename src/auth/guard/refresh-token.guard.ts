import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokensStrategy } from '../../common';

@Injectable()
export class RefreshTokenGuard extends AuthGuard(
  TokensStrategy.REFRESH_TOKEN,
) {}
