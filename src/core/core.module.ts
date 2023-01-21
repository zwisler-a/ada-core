import { Module } from '@nestjs/common';
import { AvailableNodeService } from './service/available-node.service';
import { ConnectorService } from './service/connector.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NodeEntity } from './persistence/entitiy/node.entitiy';
import { EdgeEntity } from './persistence/entitiy/edge.entity';
import { NetworkEntity } from './persistence/entitiy/network.entity';
import { NodeMapperService } from './persistence/mapper/node-mapper.service';
import { EdgeMapperService } from './persistence/mapper/edge-mapper.service';
import { NetworkMapperService } from './persistence/mapper/network-mapper.service';
import { NetworkService } from './service/network.service';
import { NetworkRepository } from './persistence/repository/network-repository.service';
import { NodeAttributeEntity } from './persistence/entitiy/node-attribute.entity';
import { NodeAttributeMapperService } from './persistence/mapper/node-attribute-mapper.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NetworkEntity,
      NodeEntity,
      EdgeEntity,
      NodeAttributeEntity,
    ]),
  ],
  controllers: [],
  providers: [
    ConnectorService,
    AvailableNodeService,
    NodeMapperService,
    NodeAttributeMapperService,
    EdgeMapperService,
    NetworkMapperService,
    NetworkRepository,
    NetworkService,
  ],
  exports: [ConnectorService, AvailableNodeService, NetworkService],
})
export class CoreModule {}
