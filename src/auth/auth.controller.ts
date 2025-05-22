import {
  Body,
  Controller,
  HttpCode,
  Post,
  Put,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { User } from '../decorators/user.decorator';
import { User as UserModel } from '../entity/user.entity';
import { SetAuthTokensInterceptor } from '../Interceptors';
import { AuthService } from './auth.service';
import { ChangePasswordDto, CreateUserDto, LoginUserDto } from './dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AccessTokenGuard, RefreshTokenGuard } from './guard';
import { CredentialsToken } from './types/auth.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @Post('register')
  @UseInterceptors(SetAuthTokensInterceptor)
  async register(@Body() user: CreateUserDto): Promise<CredentialsToken> {
    return this.authService.register(user);
  }

  @ApiOperation({ summary: 'Авторизация пользователя' })
  @Post('login')
  @UseInterceptors(SetAuthTokensInterceptor)
  @HttpCode(200)
  async login(@Body() user: LoginUserDto): Promise<CredentialsToken> {
    return this.authService.login(user);
  }

  @ApiOperation({ summary: 'Выход пользователя' })
  @Post('logout')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  async logout(@User() user: UserModel): Promise<void> {
    return this.authService.logout(user.id);
  }

  @ApiOperation({ summary: 'Обновление токена' })
  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  async refreshTokens(
    @Res({ passthrough: true }) response: FastifyReply,
    @Body() refreshDto: RefreshTokenDto,
    @User() user: UserModel,
  ): Promise<RefreshTokenDto> {
    const { accessToken, refreshToken } = await this.authService.refreshToken(
      user.id,
      refreshDto.refreshToken,
    );
    response.setCookie('accessToken', accessToken);
    return { refreshToken };
  }

  // @ApiOperation({ summary: 'Восстановление пароля' })
  // @Post('password/restore')
  // @UseGuards(AccessTokenGuard)
  // @HttpCode(200)
  // async restorePassword(
  //   @Body() data: RestorePasswordDto,
  //   @User() user: UserModel,
  // ): Promise<void> {
  //   return this.authService.restorePassword(data, user);
  // }

  @ApiOperation({ summary: 'Изменить пароль пользователя' })
  @UseGuards(AccessTokenGuard)
  @Put('password/change')
  async changePassword(
    @Body() data: ChangePasswordDto,
    @User() user: UserModel,
  ): Promise<{ info: string }> {
    return this.authService.changePassword(data, user);
  }
}
