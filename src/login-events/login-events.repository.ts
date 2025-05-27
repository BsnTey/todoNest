import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from '../database';
import { LoginEvent } from '../entity/login-event.entity';
import { LoginEventDto } from './dto/login-event.dto';

@Injectable()
export class LoginEventsRepository {
  private readonly loginEventModel: typeof LoginEvent;

  constructor(@Inject(SEQUELIZE) private sequelizeInstance: Sequelize) {
    this.loginEventModel = this.sequelizeInstance.getRepository(LoginEvent);
  }

  async bulkCreate(events: LoginEventDto[]) {
    return this.loginEventModel.bulkCreate(events);
  }
}
