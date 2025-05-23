import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcrypt';
import { redisRefreshKey } from '../cache/cache.keys';
import { CacheService } from '../cache/cache.service';
import { UserRole } from '../common';
import { appConfig } from '../config';
import { User as UserModel } from '../entity/user.entity';
import { UserService } from '../user/user.service';
import { ChangePasswordDto, CreateUserDto, LoginUserDto } from './dto';
import { CredentialsToken, IJWTPayload } from './types/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly cacheService: CacheService,
  ) {}

  async register(
    createUserDto: CreateUserDto,
    role: UserRole = UserRole.USER,
  ): Promise<CredentialsToken> {
    const user = await this.userService.findByEmail(createUserDto.email);
    if (user) throw new BadRequestException('Пользователь уже существует');

    const hash = await this.hashPassword(createUserDto.password);
    const newUser = await this.userService.create({
      ...createUserDto,
      password: hash,
      role,
    });

    return this.createAndUpdateTokens(newUser.id);
  }

  async login(userDto: LoginUserDto): Promise<CredentialsToken> {
    const user = await this.userService.findByEmail(userDto.email);
    if (!user) throw new BadRequestException('Логин или пароль не верный');

    const isValidPassword = await this.validatePassword(
      userDto.password,
      user.password,
    );

    if (!isValidPassword)
      throw new BadRequestException('Логин или пароль не верный');

    return this.createAndUpdateTokens(user.id);
  }

  async logout(userId: string) {
    await this.cacheService.del(redisRefreshKey(userId));
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    return hash(password, salt);
  }

  private async validatePassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    return compare(password, hashPassword);
  }

  async refreshToken(
    userId: string,
    refreshTokenDto: string,
  ): Promise<CredentialsToken> {
    const { id } = await this.userService.getUserById(userId);

    const value = await this.cacheService.get<{ refreshToken: string }>(
      redisRefreshKey(userId),
    );

    if (!value || value.refreshToken !== refreshTokenDto)
      throw new ForbiddenException('Доступ запрещен');

    return this.createAndUpdateTokens(id);
  }

  private async createAndUpdateTokens(
    userId: string,
  ): Promise<CredentialsToken> {
    const tokens = await this.getTokens({ id: userId });
    await this.cacheService.set<{ refreshToken: string }>(
      redisRefreshKey(userId),
      {
        refreshToken: tokens.refreshToken,
      },
    );
    return tokens;
  }

  private async getTokens(payload: IJWTPayload): Promise<CredentialsToken> {
    const [accessToken, refreshToken] = await Promise.all([
      this.createToken(
        payload,
        appConfig.jwt.accessSecret,
        appConfig.jwt.accessExpirationTime,
      ),
      this.createToken(
        payload,
        appConfig.jwt.refreshSecret,
        appConfig.jwt.refreshExpirationTime,
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private async createToken(
    payload: IJWTPayload,
    secret: string,
    expiresIn: string,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });
  }

  async restorePassword() {}

  async changePassword(data: ChangePasswordDto, user: UserModel) {
    const isValidPassword = await this.validatePassword(
      data.password,
      user.password,
    );

    if (!isValidPassword) throw new BadRequestException('Ошибка запроса');
    const hash = await this.hashPassword(data.newPassword);
    const [count] = await this.userService.update(user.id, {
      password: hash,
    });

    if (count) {
      return {
        info: 'Пароль успешно изменен',
      };
    }

    throw new BadRequestException('Ошибка запроса');
  }
}
