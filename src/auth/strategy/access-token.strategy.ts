import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokensStrategy } from '../../common';
import { appConfig } from '../../config';
import { User } from '../../entity/user.entity';
import { UserService } from '../../user/user.service';
import { IJWTPayload } from '../types/auth.interface';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  TokensStrategy.ACCESS_TOKEN,
) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfig.jwt.accessSecret,
    });
  }

  async validate(payload: IJWTPayload): Promise<User> {
    return this.userService.getUserById(payload.id);
  }
}
