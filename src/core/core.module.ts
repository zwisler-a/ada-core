import { Module } from '@nestjs/common';
import { AvailableDeviceService } from './service/available-device.service';
import { ExternalServiceRegisterService } from './service/external-service-register.service';
import { ExternalServiceService } from './service/external-service.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ExternalServiceRegisterService, ExternalServiceService, AvailableDeviceService],
  exports: [ExternalServiceRegisterService, AvailableDeviceService],
})
export class CoreModule { }
