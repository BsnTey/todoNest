import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from '../database';
import { Task, TaskCreationAttrs } from '../entity/task.entity';
import { TasksQueryDto, UpdateTaskDto } from './dto';

@Injectable()
export class TaskRepository {
  private readonly taskModel: typeof Task;

  constructor(@Inject(SEQUELIZE) private sequelizeInstance: Sequelize) {
    this.taskModel = this.sequelizeInstance.getRepository(Task);
  }

  async create(taskData: TaskCreationAttrs): Promise<Task> {
    return this.taskModel.create(taskData);
  }

  async findAllWithFilters(
    query: TasksQueryDto,
  ): Promise<{ count: number; rows: Task[] }> {
    const { limit, offset, search, status, severity, creatorId, assigneeId } =
      query;
    const where: Record<string | symbol, unknown> = {};
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (creatorId) where.creatorId = creatorId;
    if (assigneeId) where.id = assigneeId;
    if (status) where.status = status;
    if (severity) where.severity = severity;

    return this.taskModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
  }

  async findById(id: string): Promise<Task | null> {
    return this.taskModel.findByPk(id);
  }

  async update(id: string, dto: UpdateTaskDto): Promise<[number, Task[]]> {
    const { title, description, status, severity, assigneeId } = dto;
    return this.taskModel.update(
      { title, description, status, severity, assigneeId },
      { where: { id }, returning: true },
    );
  }

  async delete(id: string): Promise<number> {
    return this.taskModel.destroy({ where: { id } });
  }
}
