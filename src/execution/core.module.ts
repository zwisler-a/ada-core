import { Module } from '@nestjs/common';
import { AvailableNodeService } from './service/available-node.service';
import { ConnectorService } from './service/connector.service';
import { NetworkExecutionService } from './service/network-execution.service';
import { PersistenceModule } from '../persistance';
import { NetworkMapper } from './mapper/network.mapper';
import { NetworkStateMapper } from './mapper/network-state.mapper';

@Module({
  imports: [PersistenceModule],
  controllers: [],
  providers: [
    ConnectorService,
    AvailableNodeService,
    NetworkExecutionService,
    NetworkMapper,
    NetworkStateMapper,
  ],
  exports: [ConnectorService, AvailableNodeService, NetworkExecutionService],
})
export class CoreModule {}
