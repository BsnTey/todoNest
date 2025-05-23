import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { BaseUpdate } from './scenes';
import { StartUpdate } from './scenes/start-scene/start.scene';
import { TelegramRepository } from './telegram.repository';
import { TelegramService } from './telegram.service';

@Module({
  imports: [UserModule],
  providers: [TelegramRepository, TelegramService, BaseUpdate, StartUpdate],
  exports: [TelegramService],
})
export class TelegramModule {}
