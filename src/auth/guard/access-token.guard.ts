import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokensStrategy } from '../../common';

@Injectable()
export class AccessTokenGuard extends AuthGuard(TokensStrategy.ACCESS_TOKEN) {}
