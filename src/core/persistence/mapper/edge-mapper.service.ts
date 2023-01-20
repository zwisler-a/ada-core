import { Injectable, Logger } from '@nestjs/common';
import { NodeEntity } from '../entitiy/node.entitiy';
import { NodeInstance } from '../../../domain/node/instance/node-instance';
import { EdgeEntity } from '../entitiy/edge.entity';
import { Edge } from '../../../domain/node/edge';

@Injectable()
export class EdgeMapperService {
  private logger: Logger = new Logger(EdgeMapperService.name);

  entityToEdge(entity: EdgeEntity, nodes: NodeInstance[]) {
    const inputNode = nodes.find(
      (node) => node.identifier === entity.inputNode.id,
    );
    const outputNode = nodes.find(
      (node) => node.identifier === entity.outputNode.id,
    );

    if (!inputNode || !outputNode) {
      throw new Error(
        `Failed to find input ${entity.inputNode.id} or output ${entity.outputNode.id} node for connection ${entity.id}`,
      );
    }

    const output = outputNode.outputs.find(
      (output) => output.identifier === entity.outputIdentifier,
    );
    const input = inputNode.inputs.find(
      (input) => input.identifier === entity.inputIdentifier,
    );
    return new Edge(output, input);
  }

  edgeToEntity(edge: Edge): EdgeEntity {
    const entity = new EdgeEntity();
    entity.id = edge.identifier;
    entity.name = edge.name;
    entity.description = edge.description;
    entity.outputNode = { id: edge.output.node.identifier } as NodeEntity;
    entity.inputNode = { id: edge.input.node.identifier } as NodeEntity;
    entity.inputIdentifier = edge.input.identifier;
    entity.outputIdentifier = edge.output.identifier;
    return entity;
  }
}
