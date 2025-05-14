import { Injectable } from '@nestjs/common';
import { PinoService } from '../logger';
import { CreateTaskDto, UpdateTaskDto } from './dto';

@Injectable()
export class TaskService {
  private readonly ctx = TaskService.name;

  constructor(private readonly logger: PinoService) {}

  async createTask(taskDto: CreateTaskDto): Promise<CreateTaskDto> {
    this.logger.log(`Задача "${taskDto.title}" создана`, this.ctx);
    return taskDto;
  }

  async getAllTasks(): Promise<[]> {
    this.logger.log(`Получение всех задач`, this.ctx);
    return [];
  }

  async getTask(id: string): Promise<{ id: string }> {
    this.logger.log(`Получение задачи с ID: ${id}`, this.ctx);
    return { id };
  }

  async getMyAuthoredTasks(): Promise<[]> {
    this.logger.log(`Получение списка созданных пользователем задач`, this.ctx);
    return [];
  }

  async getMyAssignedTasks(): Promise<[]> {
    this.logger.log(
      `Получение списка назначенных пользователю задач`,
      this.ctx,
    );
    return [];
  }

  async updateTask(id: string, taskDto: UpdateTaskDto): Promise<UpdateTaskDto> {
    this.logger.log(`Обновление задачи с ID: ${id}`, this.ctx);
    return taskDto;
  }

  async deleteTask(id: string): Promise<boolean> {
    this.logger.log(`Удаление задачи с ID: ${id}`, this.ctx);
    return true;
  }
}
