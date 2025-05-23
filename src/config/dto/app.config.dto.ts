import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
import { NestedConfigDto } from '../../decorators';
import { JWTConfigDto } from './jwt.config.dto';
import { PostgresConfigDto } from './postgres.config.dto';
import { RabbitConfigDto } from './rabbit.config.dto';
import { RedisConfigDto } from './redis.config.dto';
import { TelegramConfigDto } from './telegram.config.dto';

export class AppConfigDto {
  @Type(() => Number)
  @IsInt()
  @Min(1024)
  @Max(65535)
  readonly port: number;

  @NestedConfigDto(PostgresConfigDto)
  readonly postgres: PostgresConfigDto;

  @NestedConfigDto(JWTConfigDto)
  readonly jwt: JWTConfigDto;

  @NestedConfigDto(RedisConfigDto)
  readonly redis: RedisConfigDto;

  @NestedConfigDto(RabbitConfigDto)
  readonly rabbit: RabbitConfigDto;

  @NestedConfigDto(TelegramConfigDto)
  readonly telegram: TelegramConfigDto;
}
