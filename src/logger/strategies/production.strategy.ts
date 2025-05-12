import { LoggerOptions } from 'pino';
import { APP_VERSION } from '../../app.constants';
import { BASE_STRATEGY } from './base.strategy';

export const PRODUCTION_STRATEGY: LoggerOptions = {
  ...BASE_STRATEGY,
  formatters: {
    ...BASE_STRATEGY.formatters,
    bindings: () => ({ appVersion: APP_VERSION }),
  },
};
