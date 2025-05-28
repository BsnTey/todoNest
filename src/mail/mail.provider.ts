import { Logger, Provider } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { appConfig } from '../config';

export const MAIL = 'MAIL';

export const mailProvider: Provider<
  Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>
> = {
  provide: MAIL,
  useFactory: async (): Promise<
    Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>
  > => {
    const transporter = nodemailer.createTransport({
      service: 'yandex',
      host: 'smtp.yandex.ru',
      port: 587,
      secure: false,
      auth: { user: appConfig.smtp.user, pass: appConfig.smtp.password },
    });

    const logger = new Logger('mailProvider');

    logger.log('Successfully connected to the mailProvider');

    return transporter;
  },
};
