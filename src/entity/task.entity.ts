import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
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

@Table
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
    type: DataType.ENUM(...Object.values(TaskStatus)),
    allowNull: false,
  })
  status: TaskStatus;

  @Column({
    type: DataType.ENUM(...Object.values(TaskSeverity)),
    allowNull: false,
  })
  severity: TaskSeverity;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  creatorId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  assigneeId: string | null;

  @BelongsTo(() => User, 'creatorId')
  creator: User;

  @BelongsTo(() => User, 'assigneeId')
  assignee: User;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
