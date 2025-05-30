import { Inject, Injectable } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { appConfig } from '../config';
import { MAIL } from './mail.provider';

@Injectable()
export class MailService {
  constructor(
    @Inject(MAIL)
    private transport: Transporter<
      SMTPTransport.SentMessageInfo,
      SMTPTransport.Options
    >,
  ) {}

  async sendEmail(toEmail: string, subject: string, text: string) {
    await this.transport.sendMail({
      from: `${appConfig.smtp.user}@yandex.ru`,
      to: toEmail,
      subject,
      text,
    });
  }
}
