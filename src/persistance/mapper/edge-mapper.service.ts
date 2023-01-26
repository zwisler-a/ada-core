import { Injectable, Logger } from '@nestjs/common';
import { EdgeEntity } from '../entitiy/edge.entity';
import { EdgeRepresentation } from '../dto/edge.dto';
import { NodeMapperService } from './node-mapper.service';
import { NodeEntity } from '../entitiy/node.entitiy';

@Injectable()
export class EdgeMapperService {
  private logger: Logger = new Logger(EdgeMapperService.name);

  constructor(private nodeMapper: NodeMapperService) {}

  entityToEdge(entity: EdgeEntity): EdgeRepresentation {
    const edge = new EdgeRepresentation();
    edge.id = entity.id;
    edge.name = entity.name;
    edge.description = entity.description;
    edge.inputIdentifier = entity.inputIdentifier;
    edge.outputIdentifier = entity.outputIdentifier;
    edge.inputNode = this.nodeMapper.entityToNode(entity.inputNode);
    edge.outputNode = this.nodeMapper.entityToNode(entity.outputNode);
    return edge;
  }

  edgeToEntity(edge: EdgeRepresentation, nodes: NodeEntity[]): EdgeEntity {
    const inputNode = nodes.find((n) => n.id === edge.inputNode.id);
    const outputNode = nodes.find((n) => n.id === edge.outputNode.id);
    const entity = new EdgeEntity();
    entity.id = edge.id;
    entity.name = edge.name;
    entity.description = edge.description;
    entity.inputIdentifier = edge.inputIdentifier;
    entity.outputIdentifier = edge.outputIdentifier;
    entity.inputNode = inputNode;
    entity.outputNode = outputNode;
    return entity;
  }
}
