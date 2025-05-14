import { Injectable } from '@nestjs/common';
import { PinoService } from '../logger';
import {
  ChangePasswordDto,
  CreateUserDto,
  LoginUserDto,
  RestorePasswordDto,
  UpdateProfileDto,
} from './dto';

@Injectable()
export class UserService {
  private readonly ctx = UserService.name;

  constructor(private readonly logger: PinoService) {}

  async registerUser(userDto: CreateUserDto): Promise<CreateUserDto> {
    this.logger.log(
      `Пользователь ${userDto.name} с email ${userDto.email} успешно зарегистрирован`,
      this.ctx,
    );
    return userDto;
  }

  async loginUser(userDto: LoginUserDto): Promise<LoginUserDto> {
    this.logger.log(`Пользователь ${userDto.email} авторизован`, this.ctx);
    return userDto;
  }

  async logoutUser(id: string): Promise<boolean> {
    this.logger.log(`Пользователь с id: ${id} вышел из системы`, this.ctx);
    return true;
  }

  async refreshTokens(userDto: LoginUserDto): Promise<LoginUserDto> {
    this.logger.log(`Созданы токены для ${userDto.email}`, this.ctx);
    return userDto;
  }

  async restorePassword(data: RestorePasswordDto): Promise<RestorePasswordDto> {
    this.logger.log(`Пароль восстановлен для ${data.email}`, this.ctx);
    return data;
  }

  async blockUser(id: string): Promise<boolean> {
    this.logger.log(`Пользователь ${id} заблокирован`, this.ctx);
    return true;
  }

  async unblockUser(id: string): Promise<boolean> {
    this.logger.log(`Пользователь ${id} разблокирован`, this.ctx);
    return true;
  }

  async getAllUsers(): Promise<[]> {
    this.logger.log(`Получение всего списка пользователей`, this.ctx);
    return [];
  }

  async getUserProfile(id: string): Promise<string> {
    this.logger.log(`Запрос профиля для ${id}`, this.ctx);
    return id;
  }

  async getTelegramLink(): Promise<string> {
    this.logger.log(`Запрос телеграм ссылки`, this.ctx);
    return 'https://t.me/xxxx';
  }

  async updateProfile(updateDto: UpdateProfileDto): Promise<UpdateProfileDto> {
    this.logger.log(`Обновление профиля для ${updateDto.name}`, this.ctx);
    return updateDto;
  }

  async changePassword(data: ChangePasswordDto): Promise<ChangePasswordDto> {
    this.logger.log(`Пароль изменен`, this.ctx);
    return data;
  }
}
