import { Module } from '@nestjs/common';
import { ConnectorService } from '../core/service/connector.service';
import { BaseNodeProvider } from './base-node.provider';
import { CoreModule } from '../core/core.module';

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
