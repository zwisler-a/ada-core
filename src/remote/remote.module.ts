import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { HttpModule } from '@nestjs/axios';
import { ConnectorService } from '../core/service/connector.service';
import { RemoteConnectorService } from './service/remote-connector.service';
import { RemoteApiService } from './service/remote-api.service';
import { AmqpService } from './service/amqp.service';

@Module({
  imports: [CoreModule, HttpModule],
  controllers: [],
  providers: [RemoteApiService, RemoteConnectorService, AmqpService],
})
export class RemoteModule {
  constructor(
    private remoteConnectorService: RemoteConnectorService,
    private connectorService: ConnectorService,
    private amqp: AmqpService,
  ) {
    this.amqp.initialize();
  }
}
