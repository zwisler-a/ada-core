import { NodeInstance } from '../../domain/node/instance/node-instance';
import { Injectable } from '@nestjs/common';
import { NodeAttributeInstance } from '../../domain/node/instance/node-attribute-instance';
import { NodeAttributeDto } from '../dto/node-attribute.dto';
import { NodeAttributeRepresentation } from '../../persistance';
import { NodeAttributeDefinition } from '../../domain';

@Injectable()
export class AttributeDtoMapper {
  dtoToAttribute(dto: NodeAttributeDto): NodeAttributeRepresentation {
    const attribute = new NodeAttributeRepresentation();
    attribute.id = dto.identifier;
    attribute.value = dto.value;
    attribute.attributeDefinitionId = dto.identifier;
    return attribute;
  }

  attributeToDto(
    attr: NodeAttributeRepresentation,
    definition: NodeAttributeDefinition,
  ): NodeAttributeDto {
    return {
      identifier: attr.id,
      definitionId: definition.identifier,
      value: attr.value,
      name: definition.name,
      description: definition.description,
    };
  }
}
