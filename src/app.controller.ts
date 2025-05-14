import { Controller, Post } from '@nestjs/common';

@Controller('example')
export class AppController {
  @Post()
  create() {
    return true;
  }
}
