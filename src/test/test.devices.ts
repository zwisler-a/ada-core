import { Device } from 'src/domain/devices/device';
import { DeviceProvider } from 'src/core/service/provider/device-provider.interface';
import { TestThermostat } from './test.thermostat.device';

export class TestDevicesProvider implements DeviceProvider {
  getAvailableDevices(): Device[] {
    return [
      new TestThermostat(1, 'Zimmer 1', 'Description')
    ];
  }
}
