import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OptionalUser } from '../common/types/user.interface';
import { User, UserCreationAttrs } from '../entity/user.entity';
import { UpdateProfileDto } from './dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private userRepository: UserRepository) {}

  async create(createUser: UserCreationAttrs): Promise<User> {
    return this.userRepository.create(createUser);
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

  async findById(userId: string): Promise<User | null> {
    this.logger.log(`Поиск профиля для ${userId}`);
    return this.userRepository.findById(userId);
  }

  async findByEmail(email: string): Promise<User | null> {
    this.logger.log(`Поиск профиля по Email: ${email}`);
    return this.userRepository.findByEmail(email);
  }

  async getUserProfile(userId: string): Promise<User> {
    this.logger.log(`Запрос профиля для ${userId}`);
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('Пользователь не найден');
    return user;
  }

  async getTelegramLink(): Promise<string> {
    this.logger.log(`Запрос телеграм ссылки`);
    return 'https://t.me/xxxx';
  }

  async updateProfile(updateDto: UpdateProfileDto): Promise<UpdateProfileDto> {
    this.logger.log(`Обновление профиля для ${updateDto.name}`);
    return updateDto;
  }

  async update(
    userId: string,
    updateUser: OptionalUser,
  ): Promise<[number, User]> {
    this.logger.log(`Обновление пользователя с ID: ${userId}`);
    const [count, [updatedUser]] = await this.userRepository.update(
      userId,
      updateUser,
    );

    return [count, updatedUser];
  }
}
