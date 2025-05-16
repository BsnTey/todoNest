import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../auth/dto';
import { UserRole } from '../common';
import { Roles } from '../decorators';
import { User } from '../entity/user.entity';
import { UpdateProfileDto } from './dto';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('user')
@ApiBearerAuth('access-token')
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
  async getAllUsers(): Promise<CreateUserDto[]> {
    return this.userService.getAllUsers();
  }

  @ApiOperation({ summary: 'Получить профиль пользователя по ID' })
  @Get('profile/:id')
  @Roles([UserRole.USER])
  async getUserProfile(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<User> {
    return this.userService.getUserProfile(id);
  }

  @ApiOperation({
    summary: 'Получить ссылку на Telegram текущего пользователя',
  })
  @Get('profile/telegram-link')
  @Roles([UserRole.USER])
  async getTelegramLink(): Promise<string> {
    return this.userService.getTelegramLink();
  }

  @ApiOperation({ summary: 'Обновить профиль пользователя' })
  @Put('profile')
  @Roles([UserRole.USER])
  async updateProfile(
    @Body() user: UpdateProfileDto,
  ): Promise<UpdateProfileDto> {
    return this.userService.updateProfile(user);
  }
}
