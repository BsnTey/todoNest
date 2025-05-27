import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LoginEventsModule } from '../login-events/login-events.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategy';

@Module({
  imports: [JwtModule.register({}), UserModule, LoginEventsModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
