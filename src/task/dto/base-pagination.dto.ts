import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class BasePaginationDto {
  @ApiPropertyOptional({
    description: 'Максимальное число записей на страницу',
    example: 100,
    default: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit = 100;

  @ApiPropertyOptional({
    description: 'Смещение от начала (offset)',
    example: 0,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset = 0;
}
