import { Module } from '@nestjs/common';
import { ConnectorService, CoreModule } from '../execution';
import { HttpModule } from '@nestjs/axios';
import { RemoteNodeApiService } from './service/remote-node-api.service';
import { AmqpService } from './service/amqp.service';
import { RemoteConnectorService } from './service/remote-connector.service';
import { ConnectorHealthService } from './service/connector-health.service';
import { RemoteConnectorNodeManagerService } from './service/remote-connector-node-manager.service';

@Module({
  imports: [CoreModule, HttpModule],
  controllers: [],
  providers: [
    RemoteNodeApiService,
    ConnectorHealthService,
    RemoteConnectorNodeManagerService,
    RemoteConnectorService,
    AmqpService,
  ],
})
export class RemoteModule {
  constructor(
    private connectorService: ConnectorService,
    private amqp: AmqpService,
    private remoteConnectorService: RemoteConnectorService,
  ) {
    this.amqp.initialize();
  }
}
