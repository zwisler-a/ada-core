import { Injectable, Logger } from '@nestjs/common';
import { Device } from '../../domain/devices/device';
import { ConnectorService } from './connector.service';

@Injectable()
export class AvailableDeviceService {

  private readonly logger = new Logger(AvailableDeviceService.name);

  constructor(private externalServiceService: ConnectorService) { }

  getAvailableDevices(): Promise<Device[]> {
    return Promise.all(
      this.externalServiceService
        .getAll()
        .filter(service => !!service.deviceProvider)
        .map((service) => service.deviceProvider.getAvailableDevices())
    ).then(arr => arr.flatMap(device => device));
  }

  async findByIdentifier(deviceIdentifier: string) {
    return (await this.getAvailableDevices()).find(device => device.identifier === deviceIdentifier);
  }
}
