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
import { NetworkPositionService } from './service/network-position.service';
import { GraphicModule } from '../graphic/graphic.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [CoreModule, GraphicModule, AuthModule],
  controllers: [NodeController, NetworkController, ConnectorController],
  providers: [
    NetworkPositionService,
    ConnectorDtoMapper,
    NodeDtoMapper,
    NetworkDtoMapper,
    EdgeDtoMapper,
    AttributeDtoMapper,
  ],
  exports: [],
})
export class ApiModule {}
