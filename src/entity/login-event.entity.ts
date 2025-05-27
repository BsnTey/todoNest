import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.entity';

export interface LoginEventCreationAttrs {
  ip: string;
  status: boolean;
  userId?: string | null;
}

@Table({
  tableName: 'login_events',
})
export class LoginEvent extends Model<LoginEvent, LoginEventCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING(45),
    allowNull: false,
  })
  ip: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  status: boolean;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  userId?: string | null;

  @BelongsTo(() => User)
  user: User;

  @CreatedAt
  createdAt: Date;
}
