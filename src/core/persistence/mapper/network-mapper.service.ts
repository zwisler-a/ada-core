import { Injectable, Logger } from '@nestjs/common';
import { NodeEntity } from '../entitiy/node.entitiy';
import { NodeInstance } from '../../../domain/node/instance/node-instance';
import { NetworkEntity } from '../entitiy/network.entity';
import { Network } from '../../../domain/node/network';
import { NodeMapperService } from './node-mapper.service';
import { EdgeMapperService } from './edge-mapper.service';

@Injectable()
export class NetworkMapperService {
  private logger: Logger = new Logger(NetworkMapperService.name);

  constructor(
    private nodeMapper: NodeMapperService,
    private edgeMapper: EdgeMapperService,
  ) {}

  async entityToNetwork(network: NetworkEntity): Promise<Network> {
    const nodes = await Promise.all(
      network.nodes.map((node) => this.nodeMapper.entityToNode(node)),
    );
    const edges = network.edges.map((edge) =>
      this.edgeMapper.entityToEdge(edge, nodes),
    );
    const n = new Network(nodes, edges);
    n.identifier = network.id;
    n.description = network.description;
    n.name = network.name;
    return n;
  }

  networkToEntity(network: Network): NetworkEntity {
    const entity = new NetworkEntity();
    entity.id = network.identifier;
    entity.name = network.name;
    entity.description = network.description;
    entity.nodes = network.nodes.map(this.nodeMapper.nodeToEntity);
    entity.edges = network.edges.map(this.edgeMapper.edgeToEntity);
    return entity;
  }
}
