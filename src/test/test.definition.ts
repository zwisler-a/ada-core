import { Connector } from 'src/domain/connector.interface';
import { TestDevicesProvider } from './test.devices';

export const testModuleDefinition: Connector = {
  name: 'Test external service',
  description: 'Dummy Service to test the integration',
  deviceProvider: new TestDevicesProvider(),
};
