import { Injectable, Logger } from '@nestjs/common';
import { Device } from '../../domain/devices/device';
import { ExternalServiceService } from '../service/external-service.service';

@Injectable()
export class AvailableDeviceService {

  private readonly logger = new Logger(AvailableDeviceService.name);

  constructor(private externalServiceService: ExternalServiceService) { }

  getAvailableDevices(): Device[] {
    return this.externalServiceService
      .getAll()
      .flatMap((service) => service.deviceProvider.getAvailableDevices());
  }

  findByIdentifier(deviceIdentifier: string) {
    return this.getAvailableDevices().find(device => device.identifier === deviceIdentifier);
  }
}
