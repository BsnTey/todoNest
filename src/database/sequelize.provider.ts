import { Logger, Provider } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { appConfig } from '../config';
import { Task } from '../entity/task.entity';
import { User } from '../entity/user.entity';

export const SEQUELIZE = 'SEQUELIZE';

export const sequelizeProvider: Provider<Sequelize> = {
  provide: SEQUELIZE,
  useFactory: async (): Promise<Sequelize> => {
    const sequelize: Sequelize = new Sequelize({
      dialect: 'postgres',
      logging: false,
      ...appConfig.postgres,
      models: [Task, User],
    });

    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    const logger = new Logger('Sequelize');

    logger.log('Successfully connected to the PostgreSQL');

    return sequelize;
  },
};
