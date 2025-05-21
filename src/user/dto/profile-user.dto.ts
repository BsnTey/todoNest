import { Expose } from 'class-transformer';
import { IsDate, IsEmail, IsString, IsUUID } from 'class-validator';

export class UserProfileResponseDto {
  @IsUUID()
  @Expose()
  id: string;

  @IsEmail()
  @Expose()
  email: string;

  @IsString()
  @Expose()
  name: string;

  @IsDate()
  @Expose()
  birthday: Date;
}
