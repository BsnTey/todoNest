import { IsEmail } from 'class-validator';
import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { UserRole } from '../common';
import { Task } from './task.entity';

export interface UserCreationAttrs {
  email: string;
  password: string;
  name?: string;
  birthday?: Date;
  role: UserRole;
  isActive: boolean;
}

@Table({ tableName: 'users' })
export class User extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  @IsEmail()
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.DATE,
  })
  birthday: Date;

  @Column({
    type: DataType.STRING,
  })
  role: UserRole;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isActive: boolean;

  @HasMany(() => Task, 'creatorId')
  createdTasks: Task[];

  @HasMany(() => Task, 'assigneeId')
  assignedTasks: Task[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
