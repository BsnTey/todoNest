import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';

@Module({
  controllers: [AppController],
  imports: [UserModule, TaskModule],
})
export class AppModule {}
