import { IsNotEmpty, IsString } from 'class-validator';

export class RedisConfigDto {
  @IsString()
  @IsNotEmpty()
  readonly connectionUrl: string;
}
