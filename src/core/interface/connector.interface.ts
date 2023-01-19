import { DeviceProvider } from '../interface/provider/device-provider.interface';
import { NodeProvider } from './provider/node-provider.interface';

export interface Connector {
  name: string;
  description: string;
  deviceProvider?: DeviceProvider;
  nodeProvider?: NodeProvider;
}
