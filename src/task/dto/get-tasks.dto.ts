import { IsNumber } from 'class-validator';
import { NestedConfigDto } from '../../decorators';
import { TaskResponseDto } from './response-task.dto';

export class AllTasksResponseDto {
  @NestedConfigDto(TaskResponseDto)
  tasks: TaskResponseDto[];

  @IsNumber()
  total: number;
}
