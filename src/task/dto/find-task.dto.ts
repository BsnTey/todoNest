import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { BaseTaskQueryDto } from './base-task-query.dto';

export class TasksQueryDto extends BaseTaskQueryDto {
  @ApiPropertyOptional({
    description: 'UUID пользователя–создателя задачи',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    format: 'uuid',
    type: String,
  })
  @IsOptional()
  @IsUUID()
  creatorId?: string;

  @ApiPropertyOptional({
    description: 'UUID ответственного за задачу пользователя',
    example: '4b825dc6-1c6a-11ec-82a8-0242ac130003',
    format: 'uuid',
    type: String,
  })
  @IsOptional()
  @IsUUID()
  assigneeId?: string;
}
