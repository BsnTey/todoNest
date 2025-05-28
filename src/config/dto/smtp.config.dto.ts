import { IsNotEmpty, IsString } from 'class-validator';

export class SmtpConfigDto {
  @IsString()
  @IsNotEmpty()
  readonly user: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
