import { Module } from '@nestjs/common';
import { CacheModule } from '../cache/cache.module';
import { LoginEventsRepository } from './login-events.repository';
import { LoginEventsService } from './login-events.service';

@Module({
  imports: [CacheModule],
  providers: [LoginEventsService, LoginEventsRepository],
  exports: [LoginEventsService],
})
export class LoginEventsModule {}
