import {
  Body,
  Controller,
  HttpCode,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { UserJWT } from '../decorators/user.decorator';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  CreateUserDto,
  LoginUserDto,
  RestorePasswordDto,
} from './dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AccessTokenGuard, RefreshTokenGuard } from './guard';
import { CredentialsToken } from './types/auth.interface';
import { UserContext } from './types/user.context.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @Post('register')
  async register(@Body() user: CreateUserDto): Promise<CredentialsToken> {
    return this.authService.register(user);
  }

  @ApiOperation({ summary: 'Авторизация пользователя' })
  @Post('login')
  @HttpCode(200)
  async login(@Body() user: LoginUserDto): Promise<CredentialsToken> {
    return this.authService.login(user);
  }

  @ApiOperation({ summary: 'Выход пользователя' })
  @Post('logout')
  @UseGuards(AccessTokenGuard)
  @HttpCode(200)
  async logout(@UserJWT() user: UserContext): Promise<void> {
    return this.authService.logout(user.userId);
  }

  @ApiOperation({ summary: 'Обновление токена' })
  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(200)
  async refreshTokens(
    @Res({ passthrough: true }) response: FastifyReply,
    @Body() refreshDto: RefreshTokenDto,
    @UserJWT() user: UserContext,
  ): Promise<RefreshTokenDto> {
    const { accessToken, refreshToken } = await this.authService.refreshToken(
      user.userId,
      refreshDto.refreshToken,
    );
    response.setCookie('accessToken', accessToken);
    return { refreshToken };
  }

  @ApiOperation({ summary: 'Восстановление пароля' })
  @Post('password/restore')
  @HttpCode(200)
  async restorePassword(@Body() data: RestorePasswordDto): Promise<void> {
    return this.authService.restorePassword();
  }

  @ApiOperation({ summary: 'Изменить пароль пользователя' })
  @Put('password/change')
  async changePassword(@Body() data: ChangePasswordDto): Promise<void> {
    return this.authService.changePassword();
  }
}
