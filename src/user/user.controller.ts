import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../auth/guard';
import { UserRole } from '../common';
import { Roles } from '../decorators';
import { User } from '../decorators/user.decorator';
import { User as UserModel } from '../entity/user.entity';
import { BasePaginationDto } from '../task/dto';
import {
  AllProfilesResponseDto,
  UpdateProfileDto,
  UserProfileResponseDto,
} from './dto';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('user')
@UseGuards(AccessTokenGuard)
@Roles([UserRole.ADMIN, UserRole.USER])
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Заблокировать пользователя по ID' })
  @Post(':id/block')
  @Roles([UserRole.ADMIN])
  @HttpCode(200)
  async blockUser(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<boolean> {
    return this.userService.blockUser(id);
  }

  @ApiOperation({ summary: 'Разблокировать пользователя по ID' })
  @Post(':id/unblock')
  @Roles([UserRole.ADMIN])
  @HttpCode(200)
  async unblockUser(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<boolean> {
    return this.userService.unblockUser(id);
  }

  @ApiOperation({ summary: 'Получить всех пользователей' })
  @Get('users')
  @Roles([UserRole.ADMIN])
  async getAllUsers(
    @Query() query: BasePaginationDto,
  ): Promise<AllProfilesResponseDto> {
    return this.userService.getAllUsers(query);
  }

  @ApiOperation({ summary: 'Получить профиль пользователя' })
  @Get('profile')
  async getUserProfile(
    @User() userModel: UserModel,
  ): Promise<UserProfileResponseDto> {
    return this.userService.getProfileById(userModel.id);
  }

  @ApiOperation({
    summary: 'Получить ссылку на Telegram текущего пользователя',
  })
  @Get('profile/telegram-link')
  async getTelegramLink(
    @User() userModel: UserModel,
  ): Promise<{ link: string }> {
    return this.userService.getTelegramLink(userModel.id);
  }

  @ApiOperation({ summary: 'Обновить профиль пользователя' })
  @Put('profile')
  async updateProfile(
    @Body() user: UpdateProfileDto,
    @User() userModel: UserModel,
  ): Promise<UserProfileResponseDto> {
    return this.userService.updateProfile(userModel.id, user);
  }
}
