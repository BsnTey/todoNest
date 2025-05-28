import { Module } from '@nestjs/common';
import { mailProvider } from './mail.provider';

@Module({
  providers: [mailProvider],
  exports: [],
})
export class MailModule {}
