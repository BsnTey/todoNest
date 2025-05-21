import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { TaskSeverity, TaskStatus } from '../../common';

export class TaskResponseDto {
  @IsUUID()
  @Expose()
  id: string;

  @IsString()
  @Expose()
  title: string;

  @IsString()
  @Expose()
  name: string;

  @IsString()
  @Expose()
  description: string;

  @IsEnum(TaskStatus)
  @Expose()
  status: TaskStatus;

  @IsEnum(TaskSeverity)
  @Expose()
  severity: TaskSeverity;

  @IsUUID()
  @Expose()
  creatorId: string;

  @IsUUID()
  @IsOptional()
  @Expose()
  assigneeId: string;
}
