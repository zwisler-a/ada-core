import { Module } from '@nestjs/common';
import { ConnectorService } from '../execution/service/connector.service';
import { BaseNodeProvider } from './base-node.provider';
import { CoreModule } from '../execution/core.module';

@Module({
  imports: [CoreModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class BaseNodesModule {
  constructor(private connectorService: ConnectorService) {
    this.connectorService.register({
      name: 'Base Logic',
      description: 'Provides a set of basic building blocks',
      nodeProvider: new BaseNodeProvider(),
    });
  }
}
