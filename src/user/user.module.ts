import { Module } from '@nestjs/common';
import { PinoService } from '../logger';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PinoService],
})
export class UserModule {}
