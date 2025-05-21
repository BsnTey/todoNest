import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import { convertModelToDto } from '../common/utils/convert-model-to-dto';
import { Task, TaskCreationAttrs } from '../entity/task.entity';
import { UserService } from '../user/user.service';
import {
  AllTasksResponseDto,
  CreateTaskDto,
  TaskResponseDto,
  TasksQueryDto,
  UpdateTaskDto,
} from './dto';
import { TaskRepository } from './task.repository';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  private readonly prefixTask = 'task:';
  private readonly prefixTasks = 'tasks:';

  constructor(
    private taskRepository: TaskRepository,
    private userService: UserService,
    private readonly cacheService: CacheService,
  ) {}

  private async validateAssignee(assigneeId: string) {
    try {
      await this.userService.getUserById(assigneeId);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new InternalServerErrorException(
        `Ошибка при проверке исполнителя: ${String(e)}`,
      );
    }
  }

  async createTask(
    taskDto: CreateTaskDto,
    creatorId: string,
  ): Promise<TaskResponseDto> {
    const { title, description, status, severity, assigneeId } = taskDto;

    if (assigneeId) {
      await this.validateAssignee(assigneeId);
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
    await this.cacheService.delByPrefix(this.prefixTasks);
    this.logger.log(
      `Задача "${task.title}" с ID: ${task.id} создана пользователем ${creatorId}`,
    );
    return convertModelToDto(TaskResponseDto, task);
  }

  async findAllWithFilters(query: TasksQueryDto): Promise<AllTasksResponseDto> {
    const queryString = JSON.stringify(query);
    const cacheKey = `${this.prefixTasks + queryString}`;

    const cached = await this.cacheService.get<AllTasksResponseDto>(cacheKey);
    if (cached) {
      this.logger.log(
        `Получение списка задач из кеша по ключам: ${queryString}`,
      );
      return cached;
    }
    this.logger.log(`Получение задач из БД по ключам: ${queryString}'`);
    const { count, rows } = await this.taskRepository.findAllWithFilters(query);
    const tasks = convertModelToDto(TaskResponseDto, rows);
    const tasksResponse = {
      total: count,
      tasks,
    };

    await this.cacheService.set(cacheKey, tasksResponse);
    return tasksResponse;
  }

  async getAndComparePrivilegesTask(
    id: string,
    userId: string,
  ): Promise<TaskResponseDto> {
    const task = await this.getTask(id);

    if (task.creatorId !== userId && task.assigneeId !== userId) {
      throw new ForbiddenException('Нет прав для доступа');
    }
    return task;
  }

  async getTask(id: string): Promise<TaskResponseDto> {
    this.logger.log(`Получение задания с ID: ${id}`);
    const task = await this.findTask(id);
    this.logger.log(`Найдено задания с ID: ${id}`);
    if (!task) throw new NotFoundException(`Задания с ID: ${id} не существует`);
    return convertModelToDto(TaskResponseDto, task);
  }

  async findTask(id: string): Promise<Task | null> {
    const cached = await this.cacheService.get<Task>(`${this.prefixTask + id}`);
    if (cached) {
      this.logger.log(`Взятие кеша задания с ID: ${id}`);
      return cached;
    }

    const task = await this.taskRepository.findById(id);
    if (task) {
      this.logger.log(`Установка в кеш задания с ID: ${id}`);
      await this.cacheService.set<Task>(`${this.prefixTask + id}`, task);
      return task;
    }
    this.logger.log(`Задание с ID не найдено: ${id}`);
    return null;
  }

  async getMyAuthoredTasks(
    query: TasksQueryDto,
    creatorId: string,
  ): Promise<AllTasksResponseDto> {
    this.logger.log(
      `Получение списка созданных пользователем: ${creatorId} задач`,
    );
    delete query['assigneeId'];
    return this.findAllWithFilters({
      ...query,
      creatorId,
    });
  }

  async getMyAssignedTasks(
    query: TasksQueryDto,
    assigneeId: string,
  ): Promise<AllTasksResponseDto> {
    this.logger.log(
      `Получение списка назначенных пользователю: ${assigneeId} задач`,
    );
    delete query['creatorId'];
    return this.findAllWithFilters({
      ...query,
      assigneeId,
    });
  }

  async updateTask(
    id: string,
    userId: string,
    taskDto: UpdateTaskDto,
  ): Promise<Task | null> {
    const task = await this.getTask(id);

    if (task.creatorId !== userId) {
      throw new ForbiddenException('Нет прав для доступа');
    }
    this.logger.log(`Обновление задачи с ID: ${id}`);

    const [count, [updated]] = await this.taskRepository.update(id, taskDto);
    if (count) {
      await this.cacheService.delByPrefix(this.prefixTasks);
      await this.cacheService.del(`${this.prefixTask + id}`);
    }
    return count ? updated : null;
  }

  async deleteTask(id: string, userId: string): Promise<boolean> {
    const task = await this.getTask(id);

    if (task.creatorId !== userId) {
      throw new ForbiddenException('Нет прав для доступа');
    }

    this.logger.log(`Удаление задачи с ID: ${id}`);
    const deletedCount = await this.taskRepository.delete(id);
    if (deletedCount) {
      await this.cacheService.delByPrefix(this.prefixTasks);
      await this.cacheService.del(`${this.prefixTask + id}`);
    }
    return Boolean(deletedCount);
  }
}
