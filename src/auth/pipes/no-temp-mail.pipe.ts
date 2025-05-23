import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { redisTempMailKey } from '../../cache/cache.keys';
import { CacheService } from '../../cache/cache.service';
import { CreateUserDto } from '../dto';

@Injectable()
export class NoTempEmailPipe implements PipeTransform {
  private logger = new Logger(NoTempEmailPipe.name);

  constructor(private readonly cacheService: CacheService) {}

  async transform(value: CreateUserDto, metadata: ArgumentMetadata) {
    const emailValue = value.email;
    if (!emailValue) return value;

    const domain = emailValue.split('@')[1]?.toLowerCase();

    const tempMail = await this.cacheService.get<{ email: string }>(
      redisTempMailKey(domain),
    );

    if (tempMail) {
      this.logger.log('Попытка регистрации на временню почту');
      throw new BadRequestException('Регистрация на временную почту запрещена');
    }

    return value;
  }
}
