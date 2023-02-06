import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ApiModule } from './api/api.module';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './execution/core.module';
import { BaseNodesModule } from './base-nodes/base-nodes.module';
import { GraphicModule } from './graphic/graphic.module';
import { RemoteModule } from './remote/remote.module';
import * as process from 'process';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // TODO Env
      type: 'sqljs',
      // host: process.env.DB_HOST || 'localhost',
      // port: Number.parseInt(process.env.DB_PORT),
      // username: process.env.DB_USER || 'root',
      // password: process.env.DB_PASSWORD || 'password',
      // database: process.env.DB_DATABASE || 'db',
      autoSave: true,
      location: process.env.DB_FILE,
      synchronize: true,
      autoLoadEntities: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    ApiModule,
    CoreModule,
    AuthModule,
    GraphicModule,

    RemoteModule,
    BaseNodesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
