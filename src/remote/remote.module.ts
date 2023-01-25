import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { HttpModule } from '@nestjs/axios';
import { ConnectorService } from '../core/service/connector.service';
import { RemoteConnectorService } from './service/remote-connector.service';
import { RemoteApiService } from './service/remote-api.service';
import { RemoteConnectorMapper } from './mapper/remote-connector.mapper';
import { ConnectorController } from './controller/remote-connector.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RemoteConnectorEntity } from './persistance/remote-connector.entity';

@Module({
  imports: [
    CoreModule,
    HttpModule,
    TypeOrmModule.forFeature([RemoteConnectorEntity]),
  ],
  controllers: [ConnectorController],
  providers: [RemoteApiService, RemoteConnectorService, RemoteConnectorMapper],
})
export class RemoteModule {
  constructor(
    private remoteConnectorService: RemoteConnectorService,
    private connectorService: ConnectorService,
  ) {
    this.connectorService.register({
      name: 'Remote Connector',
      description:
        'This connector is able to connect to remote parts of a network',
      nodeProvider: remoteConnectorService,
    });
  }
}
