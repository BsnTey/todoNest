import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
import { NestedConfigDto } from '../../decorators';
import { PostgresConfigDto } from './postgres.config.dto';

export class AppConfigDto {
  @Type(() => Number)
  @IsInt()
  @Min(1024)
  @Max(65535)
  readonly port: number;

  @NestedConfigDto(PostgresConfigDto)
  readonly postgres: PostgresConfigDto;
}
