import { EdgeDto } from '../dto/edge.dto';
import { NodeDtoMapper } from './node.mapper';
import { Injectable } from '@nestjs/common';
import { EdgeRepresentation, NodeRepresentation } from '../../persistance';

@Injectable()
export class EdgeDtoMapper {
  constructor(private nodeMapper: NodeDtoMapper) {}

  edgeToDto(edge: EdgeRepresentation): EdgeDto {
    return {
      identifier: edge.id,
      name: edge.name,
      description: edge.description,
      inputNodeIdentifier: edge.inputNode.id,
      outputNodeIdentifier: edge.outputNode.id,
      outputIdentifier: edge.outputIdentifier,
      inputIdentifier: edge.inputIdentifier,
    };
  }

  dtoToEdge(edgeDto: EdgeDto, nodes: NodeRepresentation[]): EdgeRepresentation {
    const inputNode = nodes.find(
      (node) => node.id === edgeDto.inputNodeIdentifier,
    );
    const outputNode = nodes.find(
      (node) => node.id === edgeDto.outputNodeIdentifier,
    );
    if (!inputNode || !outputNode) {
      throw new Error(
        `Could not find node ${edgeDto.inputIdentifier} or node ${edgeDto.outputIdentifier}`,
      );
    }
    const e = new EdgeRepresentation();
    e.id = edgeDto.identifier;
    e.name = edgeDto.name;
    e.description = edgeDto.description;
    e.inputNode = inputNode;
    e.outputNode = outputNode;
    e.inputIdentifier = edgeDto.inputIdentifier;
    e.outputIdentifier = edgeDto.outputIdentifier;
    return e;
  }
}
