import { NodeInstance } from '../../domain/node/instance/node-instance';
import { Injectable } from '@nestjs/common';
import { AvailableNodeService } from '../../core/service/available-node.service';
import { NodeAttributeInstance } from '../../domain/node/instance/node-attribute-instance';
import { NodeAttributeDto } from '../dto/node-attribute.dto';

@Injectable()
export class AttributeDtoMapper {
  dtoToAttribute(
    dto: NodeAttributeDto,
    instance: NodeInstance,
  ): NodeAttributeInstance {
    const attributeDefinition = instance.definition.attributes.find(
      (attrDefinition) => dto.identifier === attrDefinition.identifier,
    );
    const attributeInstance = attributeDefinition.createInstance(instance);
    attributeInstance.value = dto.value;
    attributeInstance.name = dto.name;
    attributeInstance.description = dto.description;
    return attributeInstance;
  }

  attributeToDto(node: NodeAttributeInstance): NodeAttributeDto {
    return {
      identifier: node.definition.identifier,
      value: node.value,
      name: node.name,
      description: node.description,
    };
  }
}
