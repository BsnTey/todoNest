import { Injectable } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { appConfig } from '../config';

@Injectable()
export class MailService {
  constructor(
    private transport: Transporter<
      SMTPTransport.SentMessageInfo,
      SMTPTransport.Options
    >,
  ) {}

  async sendEmail(toEmail: string) {
    await this.transport.sendMail({
      from: `${appConfig.smtp.user}@yandex.ru`,
      to: toEmail,
      subject: 'Example subject!',
      text: `Example message!`,
    });
  }
}
