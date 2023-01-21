import { Injectable, Logger } from '@nestjs/common';
import { NodeAttributeEntity } from '../entitiy/node-attribute.entity';
import { NodeAttributeInstance } from '../../../domain/node/instance/node-attribute-instance';
import { NodeInstance } from '../../../domain/node/instance/node-instance';

@Injectable()
export class NodeAttributeMapperService {
  private logger: Logger = new Logger(NodeAttributeMapperService.name);

  entityToAttribute(
    entity: NodeAttributeEntity,
    nodeDefinition: NodeInstance,
  ): NodeAttributeInstance {
    const attributeDefinition = nodeDefinition.definition.attributes.find(
      (attribute) => attribute.identifier === entity.attributeDefinitionId,
    );
    const instance = attributeDefinition.createInstance(nodeDefinition);
    instance.identifier = entity.id;
    instance.value = entity.value ? JSON.parse(entity.value) : '';
    return instance;
  }

  attributeToEntity(attr: NodeAttributeInstance): NodeAttributeEntity {
    const entity = new NodeAttributeEntity();
    entity.id = attr.identifier;
    entity.attributeDefinitionId = attr.definition.identifier;
    entity.value = JSON.stringify(attr.value);
    return entity;
  }
}
