import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NodeEntity } from './entitiy/node.entitiy';
import { EdgeEntity } from './entitiy/edge.entity';
import { NetworkEntity } from './entitiy/network.entity';
import { NodeAttributeEntity } from './entitiy/node-attribute.entity';
import { PersistenceService } from './persistence.service';
import { NodeMapperService } from './mapper/node-mapper.service';
import { EdgeMapperService } from './mapper/edge-mapper.service';
import { NodeAttributeMapperService } from './mapper/node-attribute-mapper.service';
import { NetworkMapperService } from './mapper/network-mapper.service';

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
    PersistenceService,
    NodeMapperService,
    EdgeMapperService,
    NodeAttributeMapperService,
    NetworkMapperService,
  ],
  exports: [PersistenceService],
})
export class PersistenceModule {}
