import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import ms, { StringValue } from 'ms';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CredentialsToken } from '../auth/types/auth.interface';
import { appConfig } from '../config';

@Injectable()
export class SetAuthTokensInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    return next.handle().pipe(
      tap((tokens: CredentialsToken) => {
        if (tokens.accessToken && tokens.refreshToken) {
          response.header('Authorization', `Bearer ${tokens.accessToken}`);
          response.setCookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/',
            maxAge: Math.floor(
              ms(appConfig.jwt.refreshExpirationTime as StringValue) / 1000,
            ),
          });
        }
      }),
      map(() => {}),
    );
  }
}
