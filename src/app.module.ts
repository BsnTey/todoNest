import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';

@Module({
  controllers: [AppController],
  imports: [UserModule, TaskModule],
})
export class AppModule {}
