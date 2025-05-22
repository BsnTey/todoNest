import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { config as readEnv } from 'dotenv';
import * as process from 'node:process';
import { AppConfigDto } from './dto';

readEnv();

type EnvStructure<T> = {
  [key in keyof T]: T[key] extends object
    ? EnvStructure<T[key]>
    : string | undefined;
};

const rawConfig: EnvStructure<AppConfigDto> = {
  port: process.env.PORT,
  postgres: {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpirationTime: process.env.JWT_ACCESS_EXPIRATION_TIME,
    refreshExpirationTime: process.env.JWT_REFRESH_EXPIRATION_TIME,
  },
  redis: {
    connectionUrl: process.env.REDIS_CONNECTION_URL,
  },
};

export const appConfig = plainToInstance(AppConfigDto, rawConfig);
const errors = validateSync(appConfig);

if (errors.length) {
  console.error('Config validation error');
  errors.forEach((error) => {
    console.error(error.toString());
  });
  console.warn('Process will now exit');
  throw Error('Envs validation failed');
}
