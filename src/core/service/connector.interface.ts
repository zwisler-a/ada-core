import { DeviceProvider } from './provider/device-provider.interface';

export interface Connector {
  name: string;
  description: string;
  deviceProvider: DeviceProvider;
}
