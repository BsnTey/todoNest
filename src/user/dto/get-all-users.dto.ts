import { IsNumber } from 'class-validator';
import { NestedConfigDto } from '../../decorators';
import { UserProfileResponseDto } from './profile-user.dto';

export class AllProfilesResponseDto {
  @NestedConfigDto(UserProfileResponseDto)
  users: UserProfileResponseDto[];

  @IsNumber()
  total: number;
}
