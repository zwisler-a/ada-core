import * as dotenv from 'dotenv';

dotenv.config();

import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as proxy from 'express-http-proxy';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as process from 'process';

console.log(process.env);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'a',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(cookieParser());
  if (process.env.USE_PROXY_EDITOR === 'true')
    app.use('/editor', proxy('localhost:8000'));
  const config = new DocumentBuilder().setTitle('Smartstuff').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}

bootstrap();
