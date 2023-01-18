import { Module } from '@nestjs/common';
import { ExternalServiceRegisterService } from './service/external-service-register.service';
import { ExternalServiceService } from './service/external-service.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ExternalServiceRegisterService, ExternalServiceService],
  exports: [ExternalServiceRegisterService],
})
export class CoreModule {}
