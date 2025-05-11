import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'qwerty123' })
  @IsString()
  @MinLength(5)
  password: string;

  @ApiProperty({ example: 'Ivan' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: '1990-01-01' })
  @IsDateString()
  @IsOptional()
  birthday?: string;
}
