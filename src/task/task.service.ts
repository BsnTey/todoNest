import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TaskSeverity, TaskStatus } from '../common';
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

  async createTask(taskDto: CreateTaskDto, creatorId: string): Promise<Task> {
    const { title, description, status, severity, assigneeId } = taskDto;

    if (assigneeId) {
      try {
        await this.userService.getUserProfile(assigneeId);
      } catch (e) {
        if (e instanceof NotFoundException) {
          throw new NotFoundException(e.message);
        } else if (e instanceof Error) {
          throw new InternalServerErrorException(
            `Произошла внутренняя ошибка при проверке исполнителя: ${e.message}`,
          );
        } else {
          throw new InternalServerErrorException(
            `Произошла непредвиденная ошибка: ${String(e)}`,
          );
        }
      }
    }

    const newTaskData: TaskCreationAttrs = {
      title,
      description,
      status,
      severity,
      creatorId,
      assigneeId: assigneeId ?? null,
    };

    const task = await this.taskRepository.create(newTaskData);
    this.logger.log(
      `Задача "${task.title}" с ID: ${task.id} создана пользователем ${creatorId}`,
    );
    return task;
  }

  async findAllWithFilters(
    userId: string | undefined,
    limit: number,
    offset: number,
    search: string,
    status: TaskStatus | undefined,
    severity: TaskSeverity | undefined,
  ): Promise<Task[]> {
    this.logger.log(
      `Получение всех задач для пользователя ${userId} с limit: ${limit}, offset: ${offset}, search: '${search}', status: '${status}', severity: '${severity}'`,
    );
    return this.taskRepository.findAllWithFilters({
      userId,
      limit,
      offset,
      search,
      status,
      severity,
    });
  }

  async getTask(id: string): Promise<Task> {
    this.logger.log(`Получение задания с ID: ${id}`);
    const task = await this.findTask(id);
    if (!task) throw new NotFoundException(`Задания с ID: ${id} не существует`);
    return task;
  }

  async findTask(id: string): Promise<Task | null> {
    this.logger.log(`Найти задание с ID: ${id}`);
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
    return Boolean(deletedCount);
  }
}
