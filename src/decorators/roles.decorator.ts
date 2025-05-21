import { Reflector } from '@nestjs/core';
import { UserRole } from '../common';

export const Roles = Reflector.createDecorator<UserRole[]>();
