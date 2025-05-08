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
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(@Body() task: CreateTaskDto): Promise<CreateTaskDto> {
    return this.taskService.createTask(task);
  }

  @Get()
  async getAllTasks(): Promise<[]> {
    return this.taskService.getAllTasks();
  }

  @Get(':id')
  async getTask(@Param('id') id: string): Promise<{ id: string }> {
    return this.taskService.getTask(id);
  }

  @Get('my/authored')
  async getMyAuthoredTasks(): Promise<[]> {
    return this.taskService.getMyAuthoredTasks();
  }

  @Get('my/assigned')
  async getMyAssignedTasks(): Promise<[]> {
    return this.taskService.getMyAssignedTasks();
  }

  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() task: UpdateTaskDto,
  ): Promise<UpdateTaskDto> {
    return this.taskService.updateTask(id, task);
  }

  @Delete(':id')
  @HttpCode(200)
  async deleteTask(@Param('id') id: string): Promise<boolean> {
    return this.taskService.deleteTask(id);
  }
}
