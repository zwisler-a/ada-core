import { Module } from '@nestjs/common';
import { ConnectorService, CoreModule } from '../execution';
import { HttpModule } from '@nestjs/axios';
import { RemoteApiService } from './service/remote-api.service';
import { AmqpService } from './service/amqp.service';
import { RemoteConnectorService } from './service/remote-connector.service';

@Module({
  imports: [CoreModule, HttpModule],
  controllers: [],
  providers: [RemoteApiService, RemoteConnectorService, AmqpService],
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
