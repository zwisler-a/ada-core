import { Module } from '@nestjs/common';
import { ConnectorService, CoreModule } from '../execution';
import { BaseNodeProvider } from './base-node.provider';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [CoreModule, HttpModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class BaseNodesModule {
  constructor(
    private connectorService: ConnectorService,
    private http: HttpService,
  ) {
    this.connectorService.register({
      name: 'Base Logic',
      description: 'Provides a set of basic building blocks',
      nodeProvider: new BaseNodeProvider(this.http),
    });
  }
}
