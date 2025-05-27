import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TelegrafModule } from 'nestjs-telegraf';
import { AuthModule } from './auth/auth.module';
import { BrokerModule } from './broker/broker.module';
import { CacheModule } from './cache/cache.module';
import { CronModule } from './cron/cron.module';
import { DatabaseModule } from './database';
import { HttpModule } from './http/http.module';
import { LoginEventsModule } from './login-events/login-events.module';
import { TaskModule } from './task/task.module';
import { getTelegramConfig } from './telegram/telegram.config';
import { TelegramModule } from './telegram/telegram.module';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    UserModule,
    TaskModule,
    DatabaseModule,
    AuthModule,
    CacheModule,
    BrokerModule,
    TelegrafModule.forRootAsync(getTelegramConfig()),
    TelegramModule,
    CronModule,
    HttpModule,
    ScheduleModule.forRoot(),
    LoginEventsModule,
    MailModule,
  ],
})
export class AppModule {}
