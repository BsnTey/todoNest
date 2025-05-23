import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { OptionalTelegramUser } from '../common/types/user.interface';
import { SEQUELIZE } from '../database';
import {
  TelegramUser,
  TelegramUserCreationAttrs,
} from '../entity/telegram-user.entity';

@Injectable()
export class TelegramRepository {
  private readonly telegramUserModel: typeof TelegramUser;

  constructor(@Inject(SEQUELIZE) private sequelizeInstance: Sequelize) {
    this.telegramUserModel = this.sequelizeInstance.getRepository(TelegramUser);
  }

  async create(
    createUser: TelegramUserCreationAttrs,
    userId?: string,
  ): Promise<TelegramUser> {
    const { telegramId, isBot, firstName, userName } = createUser;
    return this.telegramUserModel.create({
      telegramId,
      isBot,
      firstName,
      userName,
      userId,
    });
  }

  async update(
    telegramId: number,
    telegramUSer: OptionalTelegramUser,
  ): Promise<[number, TelegramUser[]]> {
    return this.telegramUserModel.update(
      {
        ...telegramUSer,
      },
      {
        where: { telegramId },
        returning: true,
      },
    );
  }

  async findByTelegramId(telegramId: number): Promise<TelegramUser | null> {
    return this.telegramUserModel.findOne({ where: { telegramId } });
  }
}
