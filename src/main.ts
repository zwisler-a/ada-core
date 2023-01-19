import * as dotenv from 'dotenv';
dotenv.config()

import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'a',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(cookieParser())

  const config = new DocumentBuilder()
    .setTitle('Smartstuff')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();
