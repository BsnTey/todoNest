import { Injectable } from '@nestjs/common';
import {
  ChangePasswordDto,
  CreateUserDto,
  LoginUserDto,
  RestorePasswordDto,
  UpdateProfileDto,
} from './dto';

@Injectable()
export class UserService {
  async registerUser(userDto: CreateUserDto): Promise<CreateUserDto> {
    console.log(
      `Пользователь ${userDto.name} с email ${userDto.email} успешно зарегистрирован`,
    );
    return userDto;
  }

  async loginUser(userDto: LoginUserDto): Promise<LoginUserDto> {
    console.log(`Пользователь ${userDto.email} авторизован`);
    return userDto;
  }

  async logoutUser(id: string): Promise<boolean> {
    console.log(`Пользователь с id: ${id} вышел из системы`);
    return true;
  }

  async refreshTokens(userDto: LoginUserDto): Promise<LoginUserDto> {
    console.log(`Созданы токены для ${userDto.email}`);
    return userDto;
  }

  async restorePassword(data: RestorePasswordDto): Promise<RestorePasswordDto> {
    console.log(`Пароль восстановлен для ${data.email}`);
    return data;
  }

  async blockUser(id: string): Promise<boolean> {
    console.log(`Пользователь ${id} заблокирован`);
    return true;
  }

  async unblockUser(id: string): Promise<boolean> {
    console.log(`Пользователь ${id} разблокирован`);
    return true;
  }

  async getAllUsers(): Promise<[]> {
    console.log('Получение всего списка пользователей');
    return [];
  }

  async getUserProfile(id: string): Promise<string> {
    console.log(`Запрос профиля для ${id}`);
    return id;
  }

  async getTelegramLink(): Promise<string> {
    console.log('Запрос телеграм ссылки');
    return 'https://t.me/xxxx';
  }

  async updateProfile(updateDto: UpdateProfileDto): Promise<UpdateProfileDto> {
    console.log(`Обновление профиля для ${updateDto.name}`);
    return updateDto;
  }

  async changePassword(data: ChangePasswordDto): Promise<ChangePasswordDto> {
    console.log(`Пароль изменен`);
    return data;
  }
}
