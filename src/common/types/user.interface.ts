import { TelegramUser } from '../../entity/telegram-user.entity';
import { User } from '../../entity/user.entity';

export type OptionalUser = Partial<User>;
export type OptionalTelegramUser = Partial<TelegramUser>;
