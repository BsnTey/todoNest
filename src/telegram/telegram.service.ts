import { Injectable, Logger } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { redisUserLinkKey } from '../cache/cache.keys';
import { CacheService } from '../cache/cache.service';
import { appConfig } from '../config';
import {
  TelegramUser,
  TelegramUserCreationAttrs,
} from '../entity/telegram-user.entity';
import { TelegramRepository } from './telegram.repository';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);

  constructor(
    private readonly cacheService: CacheService,
    private telegramRepository: TelegramRepository,
    @InjectBot() private readonly bot: Telegraf,
  ) {}

  async createOrUpdate(
    attrs: TelegramUserCreationAttrs,
    userLink?: string,
  ): Promise<TelegramUser> {
    const existUser = await this.findByTelegramId(attrs.telegramId);
    const linkedUserId = userLink
      ? await this.consumeUserLink(userLink)
      : undefined;

    if (!existUser) {
      const createdUser = await this.createUser(attrs, linkedUserId);
      this.logger.log(
        `Пользователь зарегистрирован в ТГ с ID: ${createdUser.userId} ${linkedUserId ? 'по' : 'без'} ссылк${linkedUserId ? 'е' : 'и'}`,
      );

      const notification = linkedUserId
        ? `Йо йо йо, этот кабан ${createdUser.userId} перешел в телегу`
        : `Йо йо йо, этот кабанчик ${createdUser.userId} пробегает мимо`;

      await this.sendMessageToAdmin(notification);
      return createdUser;
    }

    if (linkedUserId && existUser.userId) {
      return existUser;
    }

    if (this.needsUpdate(existUser, attrs, linkedUserId)) {
      this.logger.log(
        `Пользователь обновил данные в ТГ с ID: ${existUser.userId}`,
      );
      return this.updateUser(attrs, linkedUserId);
    }

    return existUser;
  }

  async findByTelegramId(telegramId: number): Promise<TelegramUser | null> {
    return this.telegramRepository.findByTelegramId(telegramId);
  }

  private async consumeUserLink(userLink: string): Promise<string | undefined> {
    const key = redisUserLinkKey(userLink);
    const data = await this.cacheService.get<{ userId: string }>(key);
    await this.cacheService.del(key);
    return data?.userId;
  }

  private async createUser(
    attrs: TelegramUserCreationAttrs,
    userId?: string,
  ): Promise<TelegramUser> {
    const { firstName, telegramId, userName, isBot } = attrs;
    return this.telegramRepository.create(
      { firstName, telegramId, userName, isBot },
      userId,
    );
  }

  private needsUpdate(
    existUser: TelegramUser,
    attrs: TelegramUserCreationAttrs,
    linkedUserId?: string,
  ): boolean {
    const { firstName, userName } = attrs;
    const nameChanged =
      existUser.firstName !== firstName || existUser.userName !== userName;
    const shouldLinkUser = !existUser.userId && !!linkedUserId;
    return nameChanged || shouldLinkUser;
  }

  private async updateUser(
    attrs: TelegramUserCreationAttrs,
    linkedUserId?: string,
  ): Promise<TelegramUser> {
    const { telegramId, firstName, userName } = attrs;
    const updatePayload: Partial<
      Pick<TelegramUser, 'firstName' | 'userName' | 'userId'>
    > = {
      firstName,
      userName,
    };
    if (linkedUserId) {
      updatePayload.userId = linkedUserId;
    }

    const [_, [updatedUser]] = await this.telegramRepository.update(
      telegramId,
      updatePayload,
    );
    return updatedUser;
  }

  async sendMessageToAdmin(text: string) {
    try {
      await this.bot.telegram.sendMessage(appConfig.telegram.admin, text);
    } catch (error) {
      this.logger.error('Ошибка при отправке сообщения:', error);
    }
  }
}
