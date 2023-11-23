import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ApiModule } from './api/api.module';
import { CoreModule } from './execution';
import { BaseNodesModule } from './base-nodes/base-nodes.module';
import { GraphicModule } from './graphic/graphic.module';
import { RemoteModule } from './remote/remote.module';
import * as process from 'process';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 3306),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: true,
      autoLoadEntities: true,
      ...(process.env.DB_TYPE === 'sqljs'
        ? {
            autoSave: true,
            location: process.env.DB_FILE,
          }
        : {}),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    ApiModule,
    CoreModule,
    GraphicModule,

    RemoteModule,
    BaseNodesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
