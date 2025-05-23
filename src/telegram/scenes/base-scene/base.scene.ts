import { UseFilters } from '@nestjs/common';
import { Ctx, Hears, On, Update } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';
import { TelegrafExceptionFilter } from '../../filters';
import { START } from './base.menu';

@Update()
@UseFilters(TelegrafExceptionFilter)
export class BaseUpdate {
  @Hears(/^\/start(?:\s+(.+))?$/)
  async onStart(@Ctx() ctx: WizardContext) {
    await ctx.scene.enter(START.scene);
  }

  @On('text')
  async unknownCommand(@Ctx() ctx: WizardContext) {
    await ctx.reply(`Неизвестная команда. Введите /start`);
  }
}
