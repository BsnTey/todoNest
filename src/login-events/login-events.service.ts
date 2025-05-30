import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { redisLoginEventKey } from '../cache/cache.keys';
import { CacheService } from '../cache/cache.service';
import { LoginEventDto } from './dto/login-event.dto';
import { LoginEventsRepository } from './login-events.repository';

@Injectable()
export class LoginEventsService {
  private readonly logger = new Logger(LoginEventsService.name);

  constructor(
    private readonly cacheService: CacheService,
    private readonly loginEventsRepository: LoginEventsRepository,
  ) {}

  async cachingEvent(event: LoginEventDto) {
    const serialized = JSON.stringify(event);
    await this.cacheService.lpush(redisLoginEventKey(), serialized);
  }

  @Interval(10000)
  async flushEventsToDb() {
    const key = redisLoginEventKey();
    const events: LoginEventDto[] = [];

    while (true) {
      const serializedEvent = await this.cacheService.rpop(key);
      if (!serializedEvent) break;

      try {
        const event = JSON.parse(serializedEvent);
        events.push(event);
      } catch (e) {
        this.logger.error('Ошибка при парсинге login events из кеша', e);
      }
    }

    if (events.length === 0) {
      return;
    }

    try {
      await this.loginEventsRepository.bulkCreate(events);
      this.logger.log(`Выгружено ${events.length} login events в БД`);
    } catch (e) {
      this.logger.error('Ошибка при сохранении login events в БД', e);
    }
  }
}
