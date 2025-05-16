import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokensStrategy } from '../../common';
import { appConfig } from '../../config';
import { IJWTPayload } from '../types/auth.interface';
import { UserContext } from '../types/user.context.interface';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  TokensStrategy.ACCESS_TOKEN,
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfig.jwt.jwtAccessSecret,
    });
  }

  validate(payload: IJWTPayload): UserContext {
    return {
      userId: payload.id,
      userRole: payload.role,
    };
  }
}
