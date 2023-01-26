import { Injectable, Logger } from '@nestjs/common';
import { NodeEntity } from '../entitiy/node.entitiy';
import { NodeAttributeMapperService } from './node-attribute-mapper.service';
import { NodeRepresentation } from '../dto/node.dto';

@Injectable()
export class NodeMapperService {
  private logger: Logger = new Logger(NodeMapperService.name);

  constructor(private attributeMapper: NodeAttributeMapperService) {}

  entityToNode(entity: NodeEntity): NodeRepresentation {
    const node = new NodeRepresentation();
    node.id = entity.id;
    node.definitionId = entity.definitionId;
    node.name = entity.name;
    node.description = entity.description;
    node.attributes = entity.attributes.map((attribute) =>
      this.attributeMapper.entityToAttribute(attribute),
    );
    return node;
  }

  nodeToEntity(node: NodeRepresentation): NodeEntity {
    const entity = new NodeEntity();
    entity.id = node.id;
    entity.name = node.name;
    entity.description = node.description;
    entity.definitionId = node.definitionId;
    entity.attributes =
      node.attributes?.map((attr) =>
        this.attributeMapper.attributeToEntity(attr),
      ) ?? [];
    return entity;
  }
}
