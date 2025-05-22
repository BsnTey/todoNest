import { Provider } from '@nestjs/common';
import { createClient } from 'redis';
import { appConfig } from '../config';

export const REDIS = 'REDIS_CLIENT';

export const redisProvider: Provider = {
  provide: REDIS,
  useFactory: async () => {
    const client = createClient({
      url: appConfig.redis.connectionUrl,
    });

    client.on('error', (err) => {
      console.error('Redis Client Error', err);
    });

    await client.connect();
    return client;
  },
};
