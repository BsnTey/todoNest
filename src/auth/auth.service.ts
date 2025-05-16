import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcrypt';
import { UserRole } from '../common';
import { appConfig } from '../config';
import { UserService } from '../user/user.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { CredentialsToken, IJWTPayload } from './types/auth.interface';

@Injectable()
export class AuthService {
  private jwtAccessSecret = appConfig.jwt.jwtAccessSecret;
  private jwtAccessExpirationTime = appConfig.jwt.jwtAccessExpirationTime;
  private jwtRefreshSecret = appConfig.jwt.jwtRefreshSecret;
  private jwtRefreshExpirationTime = appConfig.jwt.jwtRefreshExpirationTime;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
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
      isBan: false,
      refreshToken: null,
    });

    return this.createAndUpdateTokens({
      id: newUser.id,
      role: newUser.role,
    });
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

    return this.createAndUpdateTokens({
      id: user.id,
      role: user.role,
    });
  }

  async logout(userId: string) {
    return this.updateRefreshToken(userId, null);
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

  async refreshToken(userId: string, refreshTokenDto: string) {
    const { refreshToken, id, role } =
      await this.userService.getUserProfile(userId);

    if (!refreshToken || refreshToken !== refreshTokenDto)
      throw new ForbiddenException('Доступ запрещен');

    return this.createAndUpdateTokens({
      id,
      role,
    });
  }

  async createAndUpdateTokens(payload: IJWTPayload): Promise<CredentialsToken> {
    const tokens = await this.getTokens(payload);

    await this.updateRefreshToken(payload.id, tokens.refreshToken);

    return tokens;
  }

  async updateRefreshToken(userId: string, refreshToken: string | null) {
    const [count] = await this.userService.update(userId, {
      refreshToken: refreshToken,
    });

    if (!count)
      throw new BadRequestException('Произошла ошибка при обновлении токена');
  }

  private async getTokens(payload: IJWTPayload): Promise<CredentialsToken> {
    const [accessToken, refreshToken] = await Promise.all([
      this.createToken(
        payload,
        this.jwtAccessSecret,
        this.jwtAccessExpirationTime,
      ),
      this.createToken(
        payload,
        this.jwtRefreshSecret,
        this.jwtRefreshExpirationTime,
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

  async changePassword() {}
}
