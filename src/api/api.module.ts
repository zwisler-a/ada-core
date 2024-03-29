import { Module } from '@nestjs/common';
import { CoreModule } from 'src/execution/core.module';
import { NetworkController } from './controller/network.controller';
import { NodeController } from './controller/node.controller';
import { NodeDtoMapper } from './mapper/node.mapper';
import { NetworkDtoMapper } from './mapper/network.mapper';
import { EdgeDtoMapper } from './mapper/edge.mapper';
import { AttributeDtoMapper } from './mapper/attribute.mapper';
import { ConnectorDtoMapper } from './mapper/connector.mapper';
import { ConnectorController } from './controller/connector.controller';
import { NetworkPositionService } from './service/network-position.service';
import { GraphicModule } from '../graphic/graphic.module';
import { PersistenceModule } from '../persistance';
import { JwtStrategy } from './jwt.strategy';
import { LoggerGateway } from './gateway/logger.gateway';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [CoreModule, PersistenceModule, GraphicModule, LoggerModule],
  controllers: [NodeController, NetworkController, ConnectorController],
  providers: [
    NetworkPositionService,
    ConnectorDtoMapper,
    NodeDtoMapper,
    NetworkDtoMapper,
    EdgeDtoMapper,
    AttributeDtoMapper,
    JwtStrategy,
    LoggerGateway,
  ],
  exports: [],
})
export class ApiModule {}
