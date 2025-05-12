import { applyDecorators } from '@nestjs/common';
import {
  ClassConstructor,
  plainToInstance,
  Transform,
} from 'class-transformer';
import { ValidateNested } from 'class-validator';

export function NestedConfigDto<T extends object>(
  cls: ClassConstructor<T>,
): PropertyDecorator {
  return applyDecorators(
    ValidateNested(),
    Transform(({ value }) => plainToInstance(cls, value)),
  );
}
