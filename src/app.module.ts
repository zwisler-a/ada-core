import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ApiModule } from './api/api.module';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { HomeAssistentModule } from './home-assistant/home-assistant.module';
import { BaseNodesModule } from './base-nodes/base-nodes.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // TODO Env
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'root',
      password: 'password',
      database: 'db',
      synchronize: true,
      autoLoadEntities: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    ApiModule,
    CoreModule,
    AuthModule,

    BaseNodesModule,
    HomeAssistentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
