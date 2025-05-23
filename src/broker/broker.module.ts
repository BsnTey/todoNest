import { Global, Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { ChannelWrapper } from 'amqp-connection-manager';
import { TelegramModule } from '../telegram/telegram.module';
import { BrokerConsumer } from './broker.consumer';
import { brokerProvider, RABBIT_MQ } from './broker.provider';

@Global()
@Module({
  imports: [TelegramModule],
  providers: [brokerProvider, BrokerConsumer],
  exports: [brokerProvider],
})
export class BrokerModule implements OnApplicationShutdown {
  @Inject(RABBIT_MQ)
  private readonly channel: ChannelWrapper;

  async onApplicationShutdown() {
    await this.channel.close();
  }
}
