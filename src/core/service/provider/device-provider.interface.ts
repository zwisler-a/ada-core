import { Device } from '../../../domain/devices/device';

export interface DeviceProvider {
  getAvailableDevices(): Device[];
}
