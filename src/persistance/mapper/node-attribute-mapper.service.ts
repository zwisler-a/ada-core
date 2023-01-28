import { Injectable, Logger } from '@nestjs/common';
import { NodeAttributeEntity } from '../entitiy/node-attribute.entity';
import { NodeAttributeRepresentation } from '../dto/node-attribute.dto';

@Injectable()
export class NodeAttributeMapperService {
  private logger: Logger = new Logger(NodeAttributeMapperService.name);

  entityToAttribute(entity: NodeAttributeEntity): NodeAttributeRepresentation {
    const attr = new NodeAttributeRepresentation();
    attr.attributeDefinitionId = entity.attributeDefinitionId;
    attr.id = entity.id;
    attr.value = JSON.parse(entity.value ?? '""');
    return attr;
  }

  attributeToEntity(attr: NodeAttributeRepresentation): NodeAttributeEntity {
    const entity = new NodeAttributeEntity();
    entity.id = attr.id;
    entity.attributeDefinitionId = attr.attributeDefinitionId;
    entity.value = JSON.stringify(attr.value);
    return entity;
  }
}
