import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { APP_VERSION } from '../app.constants';

export const bootstrapSwagger = (app: INestApplication) => {
  const title = 'My App';

  const config = new DocumentBuilder()
    .setTitle(title)
    .setVersion(APP_VERSION)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);
};
