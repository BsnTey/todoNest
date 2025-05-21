import { IsNotEmpty, IsString } from 'class-validator';

export class JWTConfigDto {
  @IsString()
  @IsNotEmpty()
  readonly accessSecret: string;

  @IsString()
  @IsNotEmpty()
  readonly refreshSecret: string;

  @IsString()
  @IsNotEmpty()
  readonly accessExpirationTime: string;

  @IsString()
  @IsNotEmpty()
  readonly refreshExpirationTime: string;
}
