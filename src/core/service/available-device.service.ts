import { Injectable, Logger } from '@nestjs/common';
import { Device } from 'src/domain/devices/device';
import { ExternalServiceService } from '../service/external-service.servic';

@Injectable()
export class AvailableDeviceService {
  private readonly logger = new Logger(AvailableDeviceService.name);

  constructor(private externalServiceService: ExternalServiceService) {}

  getAvailableDevices(): Device[] {
    return this.externalServiceService
      .getAll()
      .flatMap((service) => service.deviceProvider.getAvailableDevices());
  }
}
