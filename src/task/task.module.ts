import { Module } from '@nestjs/common';
import { PinoService } from '../logger';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  providers: [TaskService, PinoService],
  controllers: [TaskController],
})
export class TaskModule {}
