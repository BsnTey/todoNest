import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { TaskSeverity, TaskStatus } from '../common';
import { User } from './user.entity';

export interface TaskCreationAttrs {
  title: string;
  description: string;
  status: TaskStatus;
  severity: TaskSeverity;
  creatorId: string;
  assigneeId: string | null;
}

@Table({ tableName: 'tasks' })
export class Task extends Model<Task, TaskCreationAttrs> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status: TaskStatus;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  severity: TaskSeverity;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  creatorId: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  assigneeId: string;

  @BelongsTo(() => User, 'creatorId')
  creator: User;

  @BelongsTo(() => User, 'assigneeId')
  assignee: User;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
