import { NetworkDto } from '../dto/network.dto';
import { Network } from '../../domain/node/network';
import { EdgeDtoMapper } from './edge.mapper';
import { NodeDtoMapper } from './node.mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NetworkDtoMapper {
  constructor(
    private nodeMapper: NodeDtoMapper,
    private edgeMapper: EdgeDtoMapper,
  ) {}

  networkToDto(network: Network): NetworkDto {
    return {
      identifier: network.identifier,
      name: network.name,
      description: network.description,
      edges: network.edges.map((e) => this.edgeMapper.edgeToDto(e)),
      nodes: network.nodes.map((n) => this.nodeMapper.nodeInstanceToDto(n)),
      active: network.isActive,
    };
  }

  async dtoToNetwork(dto: NetworkDto): Promise<Network> {
    const nodes = await Promise.all(
      dto.nodes.map((n) => this.nodeMapper.dtoToNode(n)),
    );
    const edges = dto.edges.map((edge) =>
      this.edgeMapper.dtoToEdge(edge, nodes),
    );
    const network = new Network(nodes, edges);
    network.identifier = dto.identifier;
    network.name = dto.name;
    network.description = dto.description;
    return network;
  }
}
