import { Injectable } from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto } from './dto';

@Injectable()
export class TaskService {
  async createTask(taskDto: CreateTaskDto): Promise<CreateTaskDto> {
    console.log(`Задача "${taskDto.title}" создана`);
    return taskDto;
  }

  async getAllTasks(): Promise<[]> {
    console.log('Получение всех задач');
    return [];
  }

  async getTask(id: string): Promise<{ id: string }> {
    console.log(`Получение задачи с ID: ${id}`);
    return { id };
  }

  async getMyAuthoredTasks(): Promise<[]> {
    console.log('Получение списка созданных пользователем задач');
    return [];
  }

  async getMyAssignedTasks(): Promise<[]> {
    console.log('Получение списка назначенных пользователю задач');
    return [];
  }

  async updateTask(id: string, taskDto: UpdateTaskDto): Promise<UpdateTaskDto> {
    console.log(`Обновление задачи с ID: ${id}`);
    return taskDto;
  }

  async deleteTask(id: string): Promise<boolean> {
    console.log(`Удаление задачи с ID: ${id}`);
    return true;
  }
}
