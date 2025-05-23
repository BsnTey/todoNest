import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TelegramConfigDto {
  @IsString()
  @IsNotEmpty()
  readonly tokenBot: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  readonly admin: number;

  @IsString()
  @IsNotEmpty()
  readonly userNameBot: number;
}
