import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class ExampleBodyDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNumber()
  age: number;
}

export enum UserRole {
  user = 'user',
  admin = 'admin',
}

export class ExampleQueryDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  limit: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  offset: number;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;
}
