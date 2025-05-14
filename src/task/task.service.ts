import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Task, TaskCreationAttrs } from '../entity/task.entity';
import { UserService } from '../user/user.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { TaskRepository } from './task.repository';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    private taskRepository: TaskRepository,
    private userService: UserService,
  ) {}

  async createTask(taskDto: CreateTaskDto, userId: string): Promise<Task> {
    const { title, description, status, severity, assigneeId } = taskDto;
    if (assigneeId) {
      const assigneeExist = await this.userService.getUserProfile(assigneeId);
      if (!assigneeExist) {
        this.logger.warn(
          `Попытка назначить задачу несуществующему пользователю: ${assigneeId}`,
        );
        throw new NotFoundException(
          `Исполнитель с ID "${assigneeId}" не найден.`,
        );
      }
    }

    const newTaskData: TaskCreationAttrs = {
      title,
      description,
      status,
      severity,
      creatorId: userId,
      assigneeId: assigneeId ?? null,
    };

    const task = await this.taskRepository.create(newTaskData);
    this.logger.log(
      `Задача "${task.title}" с ID: ${task.id} создана пользователем ${userId}`,
    );
    return task;
  }

  async getAllTasks(): Promise<Task[]> {
    this.logger.log(`Получение всех задач`);
    return this.taskRepository.findAll();
  }

  async getTask(id: string): Promise<Task | null> {
    this.logger.log(`Получение задания с ID: ${id}`);
    return this.taskRepository.findById(id);
  }

  async getMyAuthoredTasks(userId: string): Promise<Task[]> {
    this.logger.log(`Получение списка созданных пользователем задач`);
    return this.taskRepository.findByCreatorId(userId);
  }

  async getMyAssignedTasks(userId: string): Promise<Task[]> {
    this.logger.log(`Получение списка назначенных пользователю задач`);
    return this.taskRepository.findByAssigneeId(userId);
  }

  async updateTask(id: string, taskDto: UpdateTaskDto): Promise<Task | null> {
    const taskExist = await this.getTask(id);
    if (!taskExist) {
      this.logger.warn(`Попытка обновить несуществующую задачу`);
      throw new NotFoundException(`Задача с ID: "${id}" не найдена`);
    }
    this.logger.log(`Обновление задачи с ID: ${id}`);
    const [count, [updated]] = await this.taskRepository.update(id, taskDto);
    return count ? updated : null;
  }

  async deleteTask(id: string): Promise<boolean> {
    const taskExist = await this.getTask(id);
    if (!taskExist) {
      this.logger.warn(`Попытка удалить несуществующую задачу`);
      throw new NotFoundException(`Задача с ID: "${id}" не найдена`);
    }
    this.logger.log(`Удаление задачи с ID: ${id}`);
    const deletedCount = await this.taskRepository.delete(id);
    return deletedCount > 0;
  }
}
