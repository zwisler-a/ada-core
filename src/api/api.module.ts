import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { NetworkController } from './controller/network.controller';
import { NodeController } from './controller/node.controller';
import { NodeDtoMapper } from './mapper/node.mapper';
import { NetworkDtoMapper } from './mapper/network.mapper';
import { EdgeDtoMapper } from './mapper/edge.mapper';
import { AttributeDtoMapper } from './mapper/attribute.mapper';
import { ConnectorDtoMapper } from './mapper/connector.service';
import { ConnectorController } from './controller/connector.controller';

@Module({
  imports: [CoreModule],
  controllers: [NodeController, NetworkController, ConnectorController],
  providers: [
    ConnectorDtoMapper,
    NodeDtoMapper,
    NetworkDtoMapper,
    EdgeDtoMapper,
    AttributeDtoMapper,
  ],
  exports: [],
})
export class ApiModule {}
