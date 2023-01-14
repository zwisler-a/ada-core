import { Connector } from 'src/domain/connector.interface';
import { TestActivator } from './test.activator';
import { TestActor } from './test.actor';
import { TestDevices } from './test.devices';
import { TestSensor } from './test.sensor';

export const testModuleDefinition: Connector = {
  name: 'Test external service',
  description: 'Dummy Service to test the integration',
  activatorProvider: new TestActivator(),
  actorProvider: new TestActor(),
  deviceProvider: new TestDevices(),
  sensorProvider: new TestSensor(),
};
