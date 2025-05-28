import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { redisTempMailKey } from '../cache/cache.keys';
import { CacheService } from '../cache/cache.service';
import { HttpService } from '../http/http.service';

@Injectable()
export class CronService implements OnModuleInit {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly cacheService: CacheService,
  ) {}

  async onModuleInit() {
    await this.getAndSaveNoTmpMail();
  }

  @Cron('0 4 * * *')
  async getAndSaveNoTmpMail() {
    try {
      this.logger.log('⏰ Запрос списка временных email');
      const { data } = await this.httpService.get<string>(
        'https://raw.githubusercontent.com/disposable/disposable-email-domains/master/domains.txt',
      );
      const emails = data.split('\n');

      await Promise.all(
        emails.map((email) =>
          this.cacheService.set(redisTempMailKey(email), { email }, 4 * 86_400),
        ),
      );
      this.logger.log(`✅ Сохранено ${emails.length} временных почт в кэш`);
    } catch (error) {
      this.logger.error('❌ Ошибка в получении или сохранении временных почт');
    }
  }
}
