import { Logger, Provider } from '@nestjs/common';
import { ChannelWrapper, connect } from 'amqp-connection-manager';
import { appConfig } from '../config';
import { RABBIT_MQ_QUEUES_LIST } from './rabbitmq.queues';

export const RABBIT_MQ = 'RABBIT_MQ';

export const brokerProvider: Provider = {
  provide: RABBIT_MQ,
  useFactory: async () => {
    const logger = new Logger('RabbitProvider');

    try {
      const channel: ChannelWrapper = connect([
        appConfig.rabbit.connectionUrl,
      ]).createChannel();

      await channel.waitForConnect();

      channel.on('connect', () => logger.log('✅ RabbitMQ подключен'));
      channel.on('disconnect', (err) =>
        logger.error('❌ RabbitMQ отключен', err),
      );

      for (const queue of RABBIT_MQ_QUEUES_LIST) {
        await channel.assertQueue(queue, { durable: true });
      }

      return channel;
    } catch (error) {
      logger.error('❌ Ошибка при инициализации RabbitMQ:', error);
      throw error;
    }
  },
};
