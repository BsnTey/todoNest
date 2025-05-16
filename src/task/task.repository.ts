import { Inject, Injectable } from '@nestjs/common';
import { Op, WhereOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from '../database';
import { Task, TaskCreationAttrs } from '../entity/task.entity';
import { UpdateTaskDto } from './dto';
import { FindAllFilters } from './interface';

@Injectable()
export class TaskRepository {
  private readonly taskModel: typeof Task;

  constructor(@Inject(SEQUELIZE) private sequelizeInstance: Sequelize) {
    this.taskModel = this.sequelizeInstance.model(Task) as typeof Task;
  }

  async create(taskData: TaskCreationAttrs): Promise<Task> {
    return this.taskModel.create(taskData);
  }

  async findAllWithFilters(filters: FindAllFilters): Promise<Task[]> {
    const { userId, limit, offset, search, status, severity } = filters;
    const where: WhereOptions<Task> = {};
    if (search) {
      where.title = {
        [Op.iLike]: `%${search}%`,
      };
    }

    if (userId) where.id = userId;
    if (status) where.status = status;
    if (severity) where.severity = severity;

    return this.taskModel.findAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
  }

  async findById(id: string): Promise<Task | null> {
    return this.taskModel.findByPk(id);
  }

  async findByCreatorId(creatorId: string): Promise<Task[]> {
    return this.taskModel.findAll({ where: { creatorId } });
  }

  async findByAssigneeId(assigneeId: string): Promise<Task[]> {
    return this.taskModel.findAll({ where: { assigneeId } });
  }

  async update(id: string, dto: UpdateTaskDto): Promise<[number, Task[]]> {
    return this.taskModel.update(
      { ...dto },
      { where: { id }, returning: true },
    );
  }

  async delete(id: string): Promise<number> {
    return this.taskModel.destroy({ where: { id } });
  }
}
