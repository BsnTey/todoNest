import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskSeverity, TaskStatus } from '../../common';
import { BasePaginationDto } from './base-pagination.dto';

export class BaseTaskQueryDto extends BasePaginationDto {
  @ApiPropertyOptional({
    description: 'Текстовый поиск по задачам',
    example: 'fix bug',
    type: String,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Фильтр по статусу задачи',
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({
    description: 'Фильтр по степени важности задачи',
    enum: TaskSeverity,
    example: TaskSeverity.HIGH,
  })
  @IsOptional()
  @IsEnum(TaskSeverity)
  severity?: TaskSeverity;
}
