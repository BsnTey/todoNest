import { IsNotEmpty, IsString } from 'class-validator';

export class JWTConfigDto {
  @IsString()
  @IsNotEmpty()
  readonly jwtAccessSecret: string;

  @IsString()
  @IsNotEmpty()
  readonly jwtRefreshSecret: string;

  @IsString()
  @IsNotEmpty()
  readonly jwtAccessExpirationTime: string;

  @IsString()
  @IsNotEmpty()
  readonly jwtRefreshExpirationTime: string;
}
