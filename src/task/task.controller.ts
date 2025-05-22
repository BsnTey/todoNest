import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../auth/guard';
import { UserRole } from '../common';
import { Roles } from '../decorators';
import { User } from '../decorators/user.decorator';
import { User as UserModel } from '../entity/user.entity';
import {
  AllTasksResponseDto,
  BaseTaskQueryDto,
  CreateTaskDto,
  TaskResponseDto,
  TasksQueryDto,
  UpdateTaskDto,
} from './dto';
import { TaskService } from './task.service';

@ApiTags('tasks')
@Controller('task')
@UseGuards(AccessTokenGuard)
@Roles([UserRole.ADMIN, UserRole.USER])
@ApiBearerAuth()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({ summary: 'Создать задание' })
  @Post()
  async createTask(
    @Body() task: CreateTaskDto,
    @User() user: UserModel,
  ): Promise<TaskResponseDto> {
    return this.taskService.createTask(task, user.id);
  }

  @ApiOperation({ summary: 'Получить все задания ' })
  @Get()
  async findAllWithFilters(
    @Query() query: TasksQueryDto,
  ): Promise<AllTasksResponseDto> {
    return this.taskService.findAllWithFilters(query);
  }

  @ApiOperation({ summary: 'Получить задание по ID' })
  @Get(':id')
  async getTask(
    @Param('id', new ParseUUIDPipe()) id: string,
    @User() user: UserModel,
  ): Promise<TaskResponseDto> {
    return this.taskService.getAndComparePrivilegesTask(id, user.id);
  }

  @ApiOperation({
    summary: 'Получить задания, созданные текущим пользователем',
  })
  @Get('my/authored')
  async getMyAuthoredTasks(
    @Query() query: BaseTaskQueryDto,
    @User() user: UserModel,
  ): Promise<AllTasksResponseDto> {
    return this.taskService.getMyAuthoredTasks(query, user.id);
  }

  @ApiOperation({
    summary: 'Получить задания, назначенные текущему пользователю',
  })
  @Get('my/assigned')
  async getMyAssignedTasks(
    @Query() query: BaseTaskQueryDto,
    @User() user: UserModel,
  ): Promise<AllTasksResponseDto> {
    return this.taskService.getMyAssignedTasks(query, user.id);
  }

  @ApiOperation({ summary: 'Обновить задание по ID' })
  @Put(':id')
  async updateTask(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() task: UpdateTaskDto,
    @User() user: UserModel,
  ) {
    return this.taskService.updateTask(id, user.id, task);
  }

  @ApiOperation({ summary: 'Удалить задание по ID' })
  @Delete(':id')
  @HttpCode(200)
  async deleteTask(
    @Param('id', new ParseUUIDPipe()) id: string,
    @User() user: UserModel,
  ) {
    const deleted = await this.taskService.deleteTask(id, user.id);
    return { deleted };
  }
}
