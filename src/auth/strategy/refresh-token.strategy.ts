import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokensStrategy } from '../../common';
import { appConfig } from '../../config';
import { IJWTPayload } from '../types/auth.interface';
import { UserContext } from '../types/user.context.interface';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  TokensStrategy.REFRESH_TOKEN,
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField(TokensStrategy.REFRESH_TOKEN),
      ignoreExpiration: false,
      secretOrKey: appConfig.jwt.jwtRefreshSecret,
    });
  }

  validate(payload: IJWTPayload): UserContext {
    return {
      userId: payload.id,
      userRole: payload.role,
    };
  }
}
