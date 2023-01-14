import { Device } from 'src/domain/devices/device';
import { DeviceProvider } from 'src/domain/provider/device-provider.interface';

export class TestDevices implements DeviceProvider {
  getAvailableDevices(): Device[] {
    return [];
  }
}
