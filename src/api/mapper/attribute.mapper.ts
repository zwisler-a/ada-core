import { Injectable } from '@nestjs/common';
import { NodeAttributeDto } from '../dto/node-attribute.dto';
import { NodeAttributeRepresentation } from '../../persistance';
import { v4 as uuidv4 } from 'uuid';
import { NodeAttributeDefinition } from '@ada/lib';

@Injectable()
export class AttributeDtoMapper {
  dtoToAttribute(dto: NodeAttributeDto): NodeAttributeRepresentation {
    const attribute = new NodeAttributeRepresentation();
    attribute.id = dto.identifier;
    attribute.value = dto.value;
    attribute.attributeDefinitionId = dto.definitionId;
    return attribute;
  }

  attributeToDto(
    attr: NodeAttributeDefinition,
    representation: NodeAttributeRepresentation,
  ): NodeAttributeDto {
    return {
      identifier: representation?.id ?? uuidv4(),
      definitionId: attr?.identifier,
      value: representation?.value,
      name: attr.name,
      description: attr.description,
    };
  }
}
