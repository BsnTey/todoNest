import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import { OptionalUser } from '../common/types/user.interface';
import { convertModelToDto } from '../common/utils/convert-model-to-dto';
import { User, UserCreationAttrs } from '../entity/user.entity';
import { BasePaginationDto } from '../task/dto';
import {
  AllProfilesResponseDto,
  UpdateProfileDto,
  UserProfileResponseDto,
} from './dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private readonly prefixUser = 'user:';

  constructor(
    private userRepository: UserRepository,
    private readonly cacheService: CacheService,
  ) {}

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

  async getAllUsers(query: BasePaginationDto): Promise<AllProfilesResponseDto> {
    this.logger.log(`Получение всего списка пользователей`);
    const { count, rows } = await this.userRepository.getAll(query);
    const users = convertModelToDto(UserProfileResponseDto, rows);
    return {
      total: count,
      users,
    };
  }

  async findById(userId: string): Promise<User | null> {
    this.logger.log(`Поиск пользователя с ID: ${userId}`);
    const cached = await this.cacheService.get<User>(
      `${this.prefixUser + userId}`,
    );
    if (cached) {
      this.logger.log(`Получение пользователя из кеша с ID: ${userId}`);
      return cached;
    }

    const user = await this.userRepository.findById(userId);
    if (user) {
      this.logger.log(`Установка в кеш пользователя с ID: ${userId}`);
      await this.cacheService.set<User>(`${this.prefixUser + userId}`, user);
      return user;
    }
    this.logger.log(`Не найден пользователь с ID: ${userId}`);
    return null;
  }

  async findByEmail(email: string): Promise<User | null> {
    this.logger.log(`Поиск профиля по Email: ${email}`);
    return this.userRepository.findByEmail(email);
  }

  async getProfileById(userId: string): Promise<UserProfileResponseDto> {
    const user = await this.getUserById(userId);
    return convertModelToDto(UserProfileResponseDto, user);
  }

  async getUserById(userId: string): Promise<User> {
    this.logger.log(`Получение пользователя для ${userId}`);
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('Пользователь не найден');
    return user;
  }

  async getTelegramLink(): Promise<string> {
    this.logger.log(`Запрос телеграм ссылки`);
    return 'https://t.me/xxxx';
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
    if (count) await this.cacheService.del(`${this.prefixUser + userId}`);
    return [count, updatedUser];
  }

  async updateProfile(userId: string, updateUser: UpdateProfileDto) {
    const [_, updatedUser] = await this.update(userId, { ...updateUser });
    return convertModelToDto(UserProfileResponseDto, updatedUser);
  }
}
