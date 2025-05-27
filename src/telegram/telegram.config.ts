import { TelegrafModuleOptions } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { appConfig } from '../config';

export const getTelegramConfig = () => ({
  useFactory: (): TelegrafModuleOptions => ({
    token: appConfig.telegram.tokenBot,
    middlewares: [session()],
  }),
});
