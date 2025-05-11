import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ChangePasswordDto,
  CreateUserDto,
  LoginUserDto,
  RestorePasswordDto,
  UpdateProfileDto,
} from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async registerUser(@Body() user: CreateUserDto): Promise<CreateUserDto> {
    return this.userService.registerUser(user);
  }

  @Post('login')
  @HttpCode(200)
  async loginUser(@Body() user: LoginUserDto): Promise<LoginUserDto> {
    return this.userService.loginUser(user);
  }

  @Post('logout')
  @HttpCode(200)
  async logoutUser(id: string) {
    return this.userService.logoutUser(id);
  }

  @Post('refresh')
  @HttpCode(200)
  async refreshTokens(@Body() refreshDto: LoginUserDto): Promise<LoginUserDto> {
    return this.userService.refreshTokens(refreshDto);
  }

  @Post('password/restore')
  @HttpCode(200)
  async restorePassword(
    @Body() data: RestorePasswordDto,
  ): Promise<RestorePasswordDto> {
    return this.userService.restorePassword(data);
  }

  @Post(':id/block')
  @HttpCode(200)
  async blockUser(@Param('id') id: string): Promise<boolean> {
    return this.userService.blockUser(id);
  }

  @Post(':id/unblock')
  @HttpCode(200)
  async unblockUser(@Param('id') id: string): Promise<boolean> {
    return this.userService.unblockUser(id);
  }

  @Get('users')
  async getAllUsers(): Promise<[]> {
    return this.userService.getAllUsers();
  }

  @Get('profile/:id')
  async getUserProfile(@Param('id') id: string): Promise<string> {
    return this.userService.getUserProfile(id);
  }

  @Get('profile/telegram-link')
  async getTelegramLink(): Promise<string> {
    return this.userService.getTelegramLink();
  }

  @Put('profile')
  async updateProfile(
    @Body() user: UpdateProfileDto,
  ): Promise<UpdateProfileDto> {
    return this.userService.updateProfile(user);
  }

  @Put('password/change')
  async changePassword(
    @Body() data: ChangePasswordDto,
  ): Promise<ChangePasswordDto> {
    return this.userService.changePassword(data);
  }
}
