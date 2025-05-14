import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task, TaskCreationAttrs } from '../entity/task.entity';
import { UpdateTaskDto } from './dto';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectModel(Task)
    private taskModel: typeof Task,
  ) {}

  async create(taskData: TaskCreationAttrs): Promise<Task> {
    return this.taskModel.create(taskData);
  }

  async findAll(): Promise<Task[]> {
    return this.taskModel.findAll();
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
