import { Injectable, Logger } from '@nestjs/common';
import { NetworkEntity } from '../entitiy/network.entity';
import { NodeMapperService } from './node-mapper.service';
import { EdgeMapperService } from './edge-mapper.service';
import { NetworkRepresentation } from '../dto/network.dto';

@Injectable()
export class NetworkMapperService {
  private logger: Logger = new Logger(NetworkMapperService.name);

  constructor(
    private nodeMapper: NodeMapperService,
    private edgeMapper: EdgeMapperService,
  ) {}

  entityToNetwork(network: NetworkEntity): NetworkRepresentation {
    const n = new NetworkRepresentation();
    n.id = network.id;
    n.description = network.description;
    n.name = network.name;
    n.active = network.active;
    n.nodes = network.nodes.map((node) => this.nodeMapper.entityToNode(node));
    n.edges = network.edges.map((edge) => this.edgeMapper.entityToEdge(edge));
    return n;
  }

  networkToEntity(network: NetworkRepresentation): NetworkEntity {
    const entity = new NetworkEntity();
    entity.id = network.id;
    entity.name = network.name;
    entity.description = network.description;
    entity.nodes = network.nodes.map((n) => this.nodeMapper.nodeToEntity(n));
    entity.edges = network.edges.map((e) =>
      this.edgeMapper.edgeToEntity(e, entity.nodes),
    );
    entity.active = network.active;
    return entity;
  }
}
