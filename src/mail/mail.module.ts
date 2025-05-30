import { Module } from '@nestjs/common';
import { mailProvider } from './mail.provider';
import { MailService } from './mail.service';

@Module({
  providers: [mailProvider, MailService],
  exports: [MailService],
})
export class MailModule {}
