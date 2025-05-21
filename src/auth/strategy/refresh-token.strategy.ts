import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { FastifyRequest } from 'fastify';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokensStrategy } from '../../common';
import { appConfig } from '../../config';
import { User } from '../../entity/user.entity';
import { UserService } from '../../user/user.service';
import { IJWTPayload } from '../types/auth.interface';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  TokensStrategy.REFRESH_TOKEN,
) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: FastifyRequest) => {
          return req?.cookies?.refreshToken || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: appConfig.jwt.refreshSecret,
    });
  }

  async validate(payload: IJWTPayload): Promise<User> {
    return this.userService.getUserById(payload.id);
  }
}
