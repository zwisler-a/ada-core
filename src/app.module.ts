import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { PersistenceModule } from './persistance/persistence.module';

@Module({
  imports: [CoreModule, PersistenceModule],
  controllers: [],
  providers: [],
})
export class AppModule {
}
