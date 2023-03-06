import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { graphqlUploadExpress } from 'graphql-upload';

import { AppModule } from './app.module';

// eslint-disable-next-line
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(graphqlUploadExpress());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(process.env.SERVER_PORT || 3006);
}
bootstrap();
