import { IsEmail } from 'class-validator';
import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  HasOne,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { UserRole } from '../common';
import { LoginEvent } from './login-event.entity';
import { Task } from './task.entity';
import { TelegramUser } from './telegram-user.entity';

export interface UserCreationAttrs {
  email: string;
  password: string;
  name?: string;
  birthday?: Date;
  role: UserRole;
  isActive?: boolean;
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
    defaultValue: true,
  })
  isActive: boolean;

  @HasMany(() => Task, 'creatorId')
  createdTasks: Task[];

  @HasMany(() => Task, 'assigneeId')
  assignedTasks: Task[];

  @HasMany(() => LoginEvent, 'userId')
  loginEvents: LoginEvent[];

  @HasOne(() => TelegramUser)
  telegramAccount: TelegramUser;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
