import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({ summary: 'Создать задание' })
  @Post()
  async createTask(@Body() task: CreateTaskDto): Promise<CreateTaskDto> {
    return this.taskService.createTask(task);
  }

  @ApiOperation({ summary: 'Получить все задания' })
  @Get()
  async getAllTasks(): Promise<CreateTaskDto[]> {
    return this.taskService.getAllTasks();
  }

  @ApiOperation({ summary: 'Получить задание по ID' })
  @Get(':id')
  async getTask(@Param('id') id: string): Promise<{ id: string }> {
    return this.taskService.getTask(id);
  }

  @ApiOperation({
    summary: 'Получить задания, созданные текущим пользователем',
  })
  @Get('my/authored')
  async getMyAuthoredTasks(): Promise<CreateTaskDto[]> {
    return this.taskService.getMyAuthoredTasks();
  }

  @ApiOperation({
    summary: 'Получить задания, назначенные текущему пользователю',
  })
  @Get('my/assigned')
  async getMyAssignedTasks(): Promise<CreateTaskDto[]> {
    return this.taskService.getMyAssignedTasks();
  }

  @ApiOperation({ summary: 'Обновить задание по ID' })
  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() task: UpdateTaskDto,
  ): Promise<UpdateTaskDto> {
    return this.taskService.updateTask(id, task);
  }

  @ApiOperation({ summary: 'Удалить задание по ID' })
  @Delete(':id')
  @HttpCode(200)
  async deleteTask(@Param('id') id: string): Promise<boolean> {
    return this.taskService.deleteTask(id);
  }
}
