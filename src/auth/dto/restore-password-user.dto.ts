import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RestorePasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;
}

export class ConfirmRestorePasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'fsdfwefw-424r5-fsdfs-fswfswfs' })
  @IsString()
  restoreToken: string;

  @ApiProperty({ example: 'newPassword' })
  @IsString()
  @MinLength(5)
  password: string;
}
