import { Injectable, Logger } from '@nestjs/common';
import { NodeAttributeEntity } from '../entitiy/node-attribute.entity';
import { NodeAttributeInstance } from '../../../domain/node/instance/node-attribute-instance';
import { NodeInstance } from '../../../domain/node/instance/node-instance';
import { NodeAttributeDefinition } from '../../../domain/node/definition/node-attribute-definition';

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
    instance.value = entity.value ? JSON.parse(entity.value) : '';
    return instance;
  }

  attributeToEntity(
    attr: NodeAttributeDefinition,
    node: NodeInstance,
  ): NodeAttributeEntity {
    const entity = new NodeAttributeEntity();
    entity.attributeDefinitionId = attr.identifier;
    const value = node.getAttribute(attr.identifier);
    entity.value = JSON.stringify(value);
    return entity;
  }
}
