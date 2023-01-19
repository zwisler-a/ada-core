import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { HomeAssistentModule } from './home-assistant/home-assistant.module';
import { PersistenceModule } from './persistance/persistence.module';

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
      autoLoadEntities: true
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),

    CoreModule,
    AuthModule,
    PersistenceModule,
    HomeAssistentModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}

// https://accounts.google.com/signin/oauth/error/v2?authError=ChVyZWRpcmVjdF91cmlfbWlzbWF0Y2gS3AEKU2llIGvDtm5uZW4gc2ljaCBuaWNodCBpbiBkaWVzZXIgQXBwIGFubWVsZGVuLCB3ZWlsIHNpZSBuaWNodCBkZW4gR29vZ2xlLVJpY2h0bGluaWVuIGbDvHIgT0F1dGjCoDIuMCBlbnRzcHJpY2h0LgoKV2VubiBTaWUgZGVyIEFwcC1FbnR3aWNrbGVyIHNpbmQsIHJlZ2lzdHJpZXJlbiBTaWUgZGVuIFdlaXRlcmxlaXR1bmdzLVVSSSBpbiBkZXIgR29vZ2xlIENsb3VkIENvbnNvbGUuCiAgGm1odHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9pZGVudGl0eS9wcm90b2NvbHMvb2F1dGgyL3dlYi1zZXJ2ZXIjYXV0aG9yaXphdGlvbi1lcnJvcnMtcmVkaXJlY3QtdXJpLW1pc21hdGNoIJADKjoKDHJlZGlyZWN0X3VyaRIqaHR0cDovL2xvY2FsaG9zdDozMDAwL2F1dGgvZ29vZ2xlL3JlZGlyZWN0MtACCAES3AEKU2llIGvDtm5uZW4gc2ljaCBuaWNodCBpbiBkaWVzZXIgQXBwIGFubWVsZGVuLCB3ZWlsIHNpZSBuaWNodCBkZW4gR29vZ2xlLVJpY2h0bGluaWVuIGbDvHIgT0F1dGjCoDIuMCBlbnRzcHJpY2h0LgoKV2VubiBTaWUgZGVyIEFwcC1FbnR3aWNrbGVyIHNpbmQsIHJlZ2lzdHJpZXJlbiBTaWUgZGVuIFdlaXRlcmxlaXR1bmdzLVVSSSBpbiBkZXIgR29vZ2xlIENsb3VkIENvbnNvbGUuCiAgGm1odHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9pZGVudGl0eS9wcm90b2NvbHMvb2F1dGgyL3dlYi1zZXJ2ZXIjYXV0aG9yaXphdGlvbi1lcnJvcnMtcmVkaXJlY3QtdXJpLW1pc21hdGNo&client_id=1031579332754-ql323h2k9ae4c0us047tt7m1mgb0n148.apps.googleusercontent.com