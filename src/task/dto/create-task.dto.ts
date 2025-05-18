import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { TaskSeverity, TaskStatus } from '../../common';

export class CreateTaskDto {
  @ApiProperty({ example: 'Сесть за работу' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({
    example: 'Перестать прокастинировать и начать заниматься делом',
  })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.NEW })
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ApiProperty({ enum: TaskSeverity, example: TaskSeverity.HIGH })
  @IsEnum(TaskSeverity)
  severity: TaskSeverity;

  @ApiPropertyOptional({ example: 'qdwdq-dasda-asda-dasda' })
  @IsString()
  @IsOptional()
  assigneeId?: string;
}
