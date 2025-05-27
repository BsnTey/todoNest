import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class LoginEventDto {
  @IsString()
  ip: string;

  @IsBoolean()
  status: boolean;

  @IsString()
  @IsOptional()
  userId?: string | null;

  constructor(partial: Partial<LoginEventDto>) {
    Object.assign(this, partial);
  }
}
