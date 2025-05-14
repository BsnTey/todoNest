import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { TaskService } from '../task/task.service';
import {
  ChangePasswordDto,
  CreateUserDto,
  LoginUserDto,
  RestorePasswordDto,
  UpdateProfileDto,
} from './dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(TaskService.name);

  constructor(private userRepository: UserRepository) {}

  async registerUser(userDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.findByEmail(userDto.email);
    if (user) throw new ConflictException('Пользователь уже существует');

    // Добавить bcrypt password

    const newUser = await this.userRepository.create(userDto);

    this.logger.log(
      `Пользователь ${userDto.name} с email ${userDto.email} успешно зарегистрирован`,
    );
    return newUser;
  }

  async loginUser(userDto: LoginUserDto): Promise<LoginUserDto> {
    this.logger.log(`Пользователь ${userDto.email} авторизован`);
    return userDto;
  }

  async logoutUser(id: string): Promise<boolean> {
    this.logger.log(`Пользователь с id: ${id} вышел из системы`);
    return true;
  }

  async refreshTokens(userDto: LoginUserDto): Promise<LoginUserDto> {
    this.logger.log(`Созданы токены для ${userDto.email}`);
    return userDto;
  }

  async restorePassword(data: RestorePasswordDto): Promise<RestorePasswordDto> {
    this.logger.log(`Пароль восстановлен для ${data.email}`);
    return data;
  }

  async blockUser(id: string): Promise<boolean> {
    this.logger.log(`Пользователь ${id} заблокирован`);
    return true;
  }

  async unblockUser(id: string): Promise<boolean> {
    this.logger.log(`Пользователь ${id} разблокирован`);
    return true;
  }

  async getAllUsers(): Promise<[]> {
    this.logger.log(`Получение всего списка пользователей`);
    return [];
  }

  async getUserProfile(id: string): Promise<User | null> {
    this.logger.log(`Запрос профиля для ${id}`);
    return this.userRepository.findById(id);
  }

  async getTelegramLink(): Promise<string> {
    this.logger.log(`Запрос телеграм ссылки`);
    return 'https://t.me/xxxx';
  }

  async updateProfile(updateDto: UpdateProfileDto): Promise<UpdateProfileDto> {
    this.logger.log(`Обновление профиля для ${updateDto.name}`);
    return updateDto;
  }

  async changePassword(data: ChangePasswordDto): Promise<ChangePasswordDto> {
    this.logger.log(`Пароль изменен`);
    return data;
  }
}
