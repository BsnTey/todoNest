import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UserContext } from '../auth/types/user.context.interface';
import { TaskSeverity, TaskStatus, UserRole } from '../common';
import { Roles } from '../decorators';
import { UserJWT } from '../decorators/user.decorator';
import { Task } from '../entity/task.entity';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { TaskService } from './task.service';

@ApiTags('tasks')
@Controller('task')
@ApiBearerAuth('access-token')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({ summary: 'Создать задание' })
  @Post()
  @Roles([UserRole.USER, UserRole.ADMIN])
  async createTask(
    @Body() task: CreateTaskDto,
    @UserJWT() user: UserContext,
  ): Promise<Task> {
    return this.taskService.createTask(task, user.userId);
  }

  @ApiOperation({ summary: 'Получить все задания ' })
  @Get()
  @Roles([UserRole.ADMIN, UserRole.USER])
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Количество записей на странице',
  })
  @ApiQuery({
    name: 'user',
    required: false,
    type: String,
    format: 'uuid',
    description: 'Зачачи конкретного пользователя ID',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Сколько записей пропустить',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Поиск по заголовку',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: TaskStatus,
    description: 'Фильтр по статусу задачи',
  })
  @ApiQuery({
    name: 'severity',
    required: false,
    enum: TaskSeverity,
    description: 'Фильтр по важности задачи',
  })
  async findAllWithFilters(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('user', new ParseUUIDPipe({ optional: true })) userId?: string,
    @Query('status', new ParseEnumPipe(TaskStatus, { optional: true }))
    status?: TaskStatus,
    @Query('severity', new ParseEnumPipe(TaskSeverity, { optional: true }))
    severity?: TaskSeverity,
  ): Promise<Task[]> {
    return this.taskService.findAllWithFilters(
      userId,
      limit,
      offset,
      search,
      status,
      severity,
    );
  }

  @ApiOperation({ summary: 'Получить задание по ID' })
  @Get(':id')
  @Roles([UserRole.USER, UserRole.ADMIN])
  async getTask(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UserJWT() user: UserContext,
  ) {
    // return this.taskService.getTask(id, user.userId);
  }

  @ApiOperation({
    summary: 'Получить задания, созданные текущим пользователем',
  })
  @Get('my/authored')
  @Roles([UserRole.USER, UserRole.ADMIN])
  async getMyAuthoredTasks(@UserJWT() user: UserContext): Promise<Task[]> {
    return this.taskService.getMyAuthoredTasks(user.userId);
  }

  @ApiOperation({
    summary: 'Получить задания, назначенные текущему пользователю',
  })
  @Get('my/assigned')
  @Roles([UserRole.USER, UserRole.ADMIN])
  async getMyAssignedTasks(@UserJWT() user: UserContext): Promise<Task[]> {
    return this.taskService.getMyAssignedTasks(user.userId);
  }

  @ApiOperation({ summary: 'Обновить задание по ID' })
  @Put(':id')
  @Roles([UserRole.USER, UserRole.ADMIN])
  async updateTask(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() task: UpdateTaskDto,
    @UserJWT() user: UserContext,
  ) {
    // return this.taskService.updateTask(id, task, user.userId);
  }

  @ApiOperation({ summary: 'Удалить задание по ID' })
  @Delete(':id')
  @Roles([UserRole.USER, UserRole.ADMIN])
  @HttpCode(200)
  async deleteTask(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UserJWT() user: UserContext,
  ) {
    // const deleted = await this.taskService.deleteTask(id, user.userId);
    // return { deleted };
  }
}
