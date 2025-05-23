import { Logger, Provider } from '@nestjs/common';
import { createClient } from 'redis';
import { appConfig } from '../config';

export const REDIS = 'REDIS_CLIENT';

export const redisProvider: Provider = {
  provide: REDIS,
  useFactory: async () => {
    const client = createClient({
      url: appConfig.redis.connectionUrl,
    });

    const logger = new Logger('Redis Provider');

    client.on('error', (err) => {
      logger.error(err);
    });

    await client.connect();
    return client;
  },
};
