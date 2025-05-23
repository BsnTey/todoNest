import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ChannelWrapper } from 'amqp-connection-manager';
import { ConsumeMessage } from 'amqplib';
import { TelegramService } from '../telegram/telegram.service';
import { UserProfileResponseDto } from '../user/dto';
import { RABBIT_MQ } from './broker.provider';
import { RABBIT_MQ_QUEUES } from './rabbitmq.queues';

@Injectable()
export class BrokerConsumer implements OnModuleInit {
  private readonly logger = new Logger(BrokerConsumer.name);

  constructor(
    @Inject(RABBIT_MQ) private readonly channel: ChannelWrapper,
    private telegramUserService: TelegramService,
  ) {}

  async onModuleInit() {
    await this.assertHandler();
  }

  async assertHandler() {
    try {
      await this.channel.consume(
        RABBIT_MQ_QUEUES.NEW_REGISTRATION_QUEUE,
        (data) => this.handleNewRegistrationQueue(data),
        { noAck: true },
      );
    } catch (err) {
      this.logger.error('Ошибка при регистрации обработчика RabbitMQ:', err);
    }
  }

  async handleNewRegistrationQueue(data: ConsumeMessage) {
    try {
      const content = data.content.toString();
      const json: UserProfileResponseDto = JSON.parse(content);
      await this.telegramUserService.sendMessageToAdmin(
        `${json.name}, Йо йо йо, чё-каво су*ара, жди сигнала!`,
      );
      this.logger.log(`Обработан новый пользователь ${content}`);
    } catch (e) {
      this.logger.error('Ошибка парсинга RabbitMQ сообщения:', e);
    }
  }
}
