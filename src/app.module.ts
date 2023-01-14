import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { ExternalServiceRegisterService } from './core/service/external-service-register.service';
import { testModuleDefinition } from './test/test.definition';

@Module({
  imports: [CoreModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(registerService: ExternalServiceRegisterService) {
    registerService.register(testModuleDefinition);
  }
}
