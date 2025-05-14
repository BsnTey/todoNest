import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Task } from '../entity/task.entity';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({ summary: 'Создать задание' })
  @Post()
  async createTask(
    @Body() task: CreateTaskDto,
    @Request() req: Request,
  ): Promise<Task> {
    // добавить юзера из jwt
    return this.taskService.createTask(task, 'eqeqe');
  }

  @ApiOperation({ summary: 'Получить все задания' })
  @Get()
  async getAllTasks(): Promise<Task[]> {
    return this.taskService.getAllTasks();
  }

  @ApiOperation({ summary: 'Получить задание по ID' })
  @Get(':id')
  async getTask(@Param('id') id: string): Promise<Task> {
    const task = await this.taskService.getTask(id);
    if (!task) {
      throw new NotFoundException(`Задача с ID: ${id} не найдена`);
    }
    return task;
  }

  @ApiOperation({
    summary: 'Получить задания, созданные текущим пользователем',
  })
  @Get('my/authored')
  async getMyAuthoredTasks(): Promise<Task[]> {
    // добавить юзера из jwt
    return this.taskService.getMyAuthoredTasks('dawdqwd');
  }

  @ApiOperation({
    summary: 'Получить задания, назначенные текущему пользователю',
  })
  @Get('my/assigned')
  async getMyAssignedTasks(): Promise<Task[]> {
    // добавить юзера из jwt
    return this.taskService.getMyAssignedTasks('dawdqwd');
  }

  @ApiOperation({ summary: 'Обновить задание по ID' })
  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() task: UpdateTaskDto,
  ): Promise<Task | null> {
    return this.taskService.updateTask(id, task);
  }

  @ApiOperation({ summary: 'Удалить задание по ID' })
  @Delete(':id')
  @HttpCode(200)
  async deleteTask(@Param('id') id: string): Promise<{ deleted: boolean }> {
    const deleted = await this.taskService.deleteTask(id);
    return { deleted };
  }
}
