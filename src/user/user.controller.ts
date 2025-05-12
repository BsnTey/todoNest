import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ChangePasswordDto,
  CreateUserDto,
  LoginUserDto,
  RestorePasswordDto,
  UpdateProfileDto,
} from './dto';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Зарегистрировать нового пользователя' })
  @Post('register')
  async registerUser(@Body() user: CreateUserDto): Promise<CreateUserDto> {
    return this.userService.registerUser(user);
  }

  @ApiOperation({ summary: 'Авторизация пользователя' })
  @Post('login')
  @HttpCode(200)
  async loginUser(@Body() user: LoginUserDto): Promise<LoginUserDto> {
    return this.userService.loginUser(user);
  }

  @ApiOperation({ summary: 'Выход пользователя' })
  @Post('logout')
  @HttpCode(200)
  async logoutUser(@Body('id') id: string): Promise<boolean> {
    return this.userService.logoutUser(id);
  }

  @ApiOperation({ summary: 'Обновление токенов' })
  @Post('refresh')
  @HttpCode(200)
  async refreshTokens(@Body() refreshDto: LoginUserDto): Promise<LoginUserDto> {
    return this.userService.refreshTokens(refreshDto);
  }

  @ApiOperation({ summary: 'Восстановление пароля' })
  @Post('password/restore')
  @HttpCode(200)
  async restorePassword(
    @Body() data: RestorePasswordDto,
  ): Promise<RestorePasswordDto> {
    return this.userService.restorePassword(data);
  }

  @ApiOperation({ summary: 'Заблокировать пользователя по ID' })
  @Post(':id/block')
  @HttpCode(200)
  async blockUser(@Param('id') id: string): Promise<boolean> {
    return this.userService.blockUser(id);
  }

  @ApiOperation({ summary: 'Разблокировать пользователя по ID' })
  @Post(':id/unblock')
  @HttpCode(200)
  async unblockUser(@Param('id') id: string): Promise<boolean> {
    return this.userService.unblockUser(id);
  }

  @ApiOperation({ summary: 'Получить всех пользователей' })
  @Get('users')
  async getAllUsers(): Promise<CreateUserDto[]> {
    return this.userService.getAllUsers();
  }

  @ApiOperation({ summary: 'Получить профиль пользователя по ID' })
  @Get('profile/:id')
  async getUserProfile(@Param('id') id: string): Promise<string> {
    return this.userService.getUserProfile(id);
  }

  @ApiOperation({
    summary: 'Получить ссылку на Telegram текущего пользователя',
  })
  @Get('profile/telegram-link')
  async getTelegramLink(): Promise<string> {
    return this.userService.getTelegramLink();
  }

  @ApiOperation({ summary: 'Обновить профиль пользователя' })
  @Put('profile')
  async updateProfile(
    @Body() user: UpdateProfileDto,
  ): Promise<UpdateProfileDto> {
    return this.userService.updateProfile(user);
  }

  @ApiOperation({ summary: 'Изменить пароль пользователя' })
  @Put('password/change')
  async changePassword(
    @Body() data: ChangePasswordDto,
  ): Promise<ChangePasswordDto> {
    return this.userService.changePassword(data);
  }
}
