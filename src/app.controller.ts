import { Controller, Get } from '@nestjs/common';

@Controller('example')
export class AppController {
  @Get()
  index() {
    return { message: 'Hello World!' };
  }
}
