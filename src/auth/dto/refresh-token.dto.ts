import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ example: 'd23e23edae23.d23e23e23e2.dq3e32e23' })
  @IsString()
  refreshToken: string;
}
