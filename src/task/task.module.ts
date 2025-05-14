import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from '../entity/task.entity';
import { UserService } from '../user/user.service';
import { TaskController } from './task.controller';
import { TaskRepository } from './task.repository';
import { TaskService } from './task.service';

@Module({
  imports: [SequelizeModule.forFeature([Task])],
  providers: [TaskService, TaskRepository, UserService],
  controllers: [TaskController],
})
export class TaskModule {}
