import { NetworkDto } from '../dto/network.dto';
import { Network } from '../../domain/node/network';
import { EdgeDtoMapper } from './edge.mapper';
import { NodeDtoMapper } from './node.mapper';
import { Injectable } from '@nestjs/common';
import { Position } from '../../graphic/position.interface';
import { NodeInstance } from '../../domain/node/instance/node-instance';
import { NetworkRepresentation, NodeRepresentation } from '../../persistance';

@Injectable()
export class NetworkDtoMapper {
  constructor(
    private nodeMapper: NodeDtoMapper,
    private edgeMapper: EdgeDtoMapper,
  ) {}

  async networkToDto(
    network: NetworkRepresentation,
    positions: Position[],
  ): Promise<NetworkDto> {
    const findPosition = (node: NodeRepresentation) =>
      positions.find((pos) => pos.identifier === node.id);
    const nodes = await Promise.all(
      network.nodes.map((n) => this.nodeMapper.nodeToDto(n, findPosition(n))),
    );
    const edges = network.edges.map((e) => this.edgeMapper.edgeToDto(e));
    return {
      identifier: network.id,
      name: network.name,
      description: network.description,
      edges,
      nodes,
      active: network.active,
    };
  }

  async dtoToNetwork(dto: NetworkDto): Promise<NetworkRepresentation> {
    const nodes = await Promise.all(
      dto.nodes.map((n) => this.nodeMapper.dtoToNode(n)),
    );
    const edges = dto.edges.map((edge) =>
      this.edgeMapper.dtoToEdge(edge, nodes),
    );
    const network = new NetworkRepresentation();
    network.id = dto.identifier;
    network.name = dto.name;
    network.description = dto.description;
    network.nodes = nodes;
    network.edges = edges;
    network.active = dto.active;
    return network;
  }
}
