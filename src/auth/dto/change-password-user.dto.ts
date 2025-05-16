import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'qwerty123' })
  @IsString()
  @MinLength(5)
  password: string;

  @ApiProperty({ example: 'newQwerty123' })
  @IsString()
  @MinLength(5)
  newPassword: string;
}
