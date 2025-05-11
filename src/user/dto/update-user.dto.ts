import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Ivan' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: '1990-01-01' })
  @IsDateString()
  @IsOptional()
  birthday?: string;
}
