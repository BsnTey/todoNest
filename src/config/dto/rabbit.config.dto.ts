import { IsNotEmpty, IsString } from 'class-validator';

export class RabbitConfigDto {
  @IsString()
  @IsNotEmpty()
  readonly connectionUrl: string;
}
