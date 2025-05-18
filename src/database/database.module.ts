import { Global, Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE, sequelizeProvider } from './sequelize.provider';

@Global()
@Module({
  providers: [sequelizeProvider],
  exports: [sequelizeProvider],
})
export class DatabaseModule implements OnApplicationShutdown {
  @Inject(SEQUELIZE)
  private readonly connection: Sequelize;

  async onApplicationShutdown() {
    await this.connection.close();
  }
}
