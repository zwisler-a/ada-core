import { Device } from 'src/domain/devices/device';

export interface DeviceProvider {
  getAvailableDevices(): Device[];
}
