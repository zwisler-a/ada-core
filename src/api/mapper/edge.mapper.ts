import { Edge } from '../../domain/node/edge';
import { EdgeDto } from '../dto/edge.dto';
import { NodeDtoMapper } from './node.mapper';
import { Injectable } from '@nestjs/common';
import { NodeInstance } from '../../domain/node/instance/node-instance';

@Injectable()
export class EdgeDtoMapper {
  constructor(private nodeMapper: NodeDtoMapper) {}

  edgeToDto(edge: Edge): EdgeDto {
    return {
      identifier: edge.identifier,
      name: edge.name,
      description: edge.description,
      inputNodeIdentifier: edge.input.node.identifier,
      outputNodeIdentifier: edge.output.node.identifier,
      outputIdentifier: edge.output.definition.identifier,
      inputIdentifier: edge.input.definition.identifier,
    };
  }

  dtoToEdge(edgeDto: EdgeDto, nodes: NodeInstance[]) {
    const inputNode = nodes.find(
      (node) => node.identifier === edgeDto.inputNodeIdentifier,
    );
    const outputNode = nodes.find(
      (node) => node.identifier === edgeDto.outputNodeIdentifier,
    );
    if (!inputNode || !outputNode) {
      throw new Error(
        `Could not find node ${edgeDto.inputIdentifier} or node ${edgeDto.outputIdentifier}`,
      );
    }
    const input = inputNode.inputs.find(
      (inputInstance) => inputInstance.identifier === edgeDto.inputIdentifier,
    );

    const output = outputNode.outputs.find(
      (inputInstance) => inputInstance.identifier === edgeDto.outputIdentifier,
    );
    if (!input || !output) {
      throw new Error(
        `Could not find node ${edgeDto.inputNodeIdentifier} input ${edgeDto.inputIdentifier} 
        or node ${edgeDto.outputNodeIdentifier} output ${edgeDto.outputNodeIdentifier}`,
      );
    }
    const e = new Edge(output, input);
    e.identifier = edgeDto.identifier;
    e.name = edgeDto.name;
    e.description = edgeDto.description;
    return e;
  }
}
