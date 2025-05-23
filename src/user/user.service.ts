import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ChannelWrapper } from 'amqp-connection-manager';
import { RABBIT_MQ } from '../broker/broker.provider';
import { RABBIT_MQ_QUEUES } from '../broker/rabbitmq.queues';
import { redisUserKey, redisUserLinkKey } from '../cache/cache.keys';
import { CacheService } from '../cache/cache.service';
import { OptionalUser } from '../common/types/user.interface';
import { convertModelToDto } from '../common/utils/convert-model-to-dto';
import { appConfig } from '../config';
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

  constructor(
    private userRepository: UserRepository,
    private readonly cacheService: CacheService,
    @Inject(RABBIT_MQ) private readonly channel: ChannelWrapper,
  ) {}

  async create(createUser: UserCreationAttrs): Promise<User> {
    const user = await this.userRepository.create(createUser);

    await this.channel.sendToQueue(
      RABBIT_MQ_QUEUES.NEW_REGISTRATION_QUEUE,
      JSON.stringify(convertModelToDto(UserProfileResponseDto, user)),
    );

    this.logger.log(`Пользователь ${user.id} создан`);
    return user;
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
    const cached = await this.cacheService.get<User>(redisUserKey(userId));
    if (cached) {
      this.logger.log(`Получение пользователя из кеша с ID: ${userId}`);
      return cached;
    }

    const user = await this.userRepository.findById(userId);
    if (user) {
      this.logger.log(`Установка в кеш пользователя с ID: ${userId}`);
      await this.cacheService.set<User>(redisUserKey(userId), user);
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

  async getTelegramLink(userId: string): Promise<{ link: string }> {
    this.logger.log(`Запрос телеграм ссылки`);

    const key = crypto.randomUUID();
    await this.cacheService.set(redisUserLinkKey(key), { userId }, 86_400);

    const userNameBot = appConfig.telegram.userNameBot;

    return { link: `https://t.me/${userNameBot}?start=${key}` };
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
    if (count) await this.cacheService.del(redisUserKey(userId));
    return [count, updatedUser];
  }

  async updateProfile(userId: string, updateUser: UpdateProfileDto) {
    const [_, updatedUser] = await this.update(userId, { ...updateUser });
    return convertModelToDto(UserProfileResponseDto, updatedUser);
  }
}
