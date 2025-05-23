import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from './user.entity';

export interface TelegramUserCreationAttrs {
  telegramId: number;
  isBot: boolean;
  firstName: string;
  userName: string;
}

@Table({ tableName: 'telegram-users' })
export class TelegramUser extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
  })
  telegramId: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isBot: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userName: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  userId?: string;

  @BelongsTo(() => User)
  user?: User;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
