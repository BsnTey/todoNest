import { Message } from '@telegraf/types';
import { Ctx, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';
import { UserService } from '../../../user/user.service';
import { SenderTelegram } from '../../interface';
import { TelegramService } from '../../telegram.service';
import { START } from '../base-scene/base.menu';

@Scene(START.scene)
export class StartUpdate {
  constructor(
    private telegramUserService: TelegramService,
    private readonly userService: UserService,
  ) {}

  @SceneEnter()
  async onSceneEnter(
    @Ctx() ctx: WizardContext,
    @Sender() telegramUser: SenderTelegram,
  ) {
    const message = ctx.message as Message.TextMessage | undefined;
    const messageText = message?.text ?? '';
    const [, userLink] = messageText.split(' ');

    const {
      first_name: firstName,
      id: telegramId,
      username: userName,
      is_bot: isBot,
    } = telegramUser;

    const userFromTg = await this.telegramUserService.createOrUpdate(
      {
        firstName,
        telegramId,
        userName,
        isBot,
      },
      userLink,
    );

    let welcomeName;
    if (userLink && userFromTg.userId) {
      const user = await this.userService.getUserById(userFromTg.userId);
      welcomeName = user.name;
    }

    await ctx.replyWithPhoto(
      'https://steamuserimages-a.akamaihd.net/ugc/1686024608989127218/51FE2BE5961E85F41889A9378C714D210BB313B2/?imw=1024&imh=1024&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true',
      {
        caption: `Добро пожаловать в бот, ${welcomeName ?? (firstName || userName || 'guy')}`,
      },
    );

    await ctx.scene.leave();
  }
}
