import { Module } from '@nestjs/common';
import { CoreNodeProvider } from './core-nodes/core-node.provider';
import { AvailableDeviceService } from './service/available-device.service';
import { AvailableNodeService } from './service/available-node.service';
import { ConnectorService } from './service/connector.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ConnectorService, AvailableNodeService, AvailableDeviceService],
  exports: [ConnectorService, AvailableNodeService, AvailableDeviceService],
})
export class CoreModule {
  constructor(private connectorService: ConnectorService) {
    this.connectorService.register({
      name: 'Core',
      description: 'Core Module',
      nodeProvider: new CoreNodeProvider()
    })
  }
}
