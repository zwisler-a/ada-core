import { ActivatorProvider } from './provider/activator-provider.interface';
import { ActorProvider } from './provider/actor-provider.interface';
import { DeviceProvider } from './provider/device-provider.interface';
import { SensorProvider } from './provider/sensor-provider.interface';

export interface Connector {
  name: string;
  description: string;
  deviceProvider: DeviceProvider;
  sensorProvider: SensorProvider;
  activatorProvider: ActivatorProvider;
  actorProvider: ActorProvider;
}
