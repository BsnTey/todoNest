import { Body, Controller, Post, Query } from '@nestjs/common';
import { ExampleBodyDto, ExampleQueryDto } from './app.dto';

@Controller('example')
export class AppController {
  @Post()
  create(@Body() body: ExampleBodyDto, @Query() query: ExampleQueryDto) {
    return { body, query };
  }
}
