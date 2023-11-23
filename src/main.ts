import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as process from 'process';
import { RetainingLogger } from './logger/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true,
  });
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'a',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Smartstuff')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.useLogger(await app.get(RetainingLogger));
  await app.listen(3000);
}

bootstrap();
