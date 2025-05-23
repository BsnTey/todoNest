import { Module } from '@nestjs/common';
import { CacheModule } from '../cache/cache.module';
import { HttpModule } from '../http/http.module';
import { CronService } from './cron.service';

@Module({
  imports: [HttpModule, CacheModule],
  providers: [CronService],
})
export class CronModule {}
