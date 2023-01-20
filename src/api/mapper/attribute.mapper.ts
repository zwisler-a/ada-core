import { NodeInputDefinitionDto } from '../dto/node-input-definition.dto';
import { NodeOutputDefinitionDto } from '../dto/node-output-definition.dto';
import { NodeDefinitionDto } from '../dto/node-definition.dto';
import { NodeDefinition } from '../../domain/node/definition/node-definition';
import { NodeInputDefinition } from '../../domain/node/definition/node-input-definition';
import { NodeOutputDefinition } from '../../domain/node/definition/node-output-definition';
import { NodeInputInstance } from '../../domain/node/instance/node-input-instance';
import { NodeInputInstanceDto } from '../dto/node-input-instance.dto';
import { NodeOutputInstance } from '../../domain/node/instance/node-output-instance';
import { NodeOutputInstanceDto } from '../dto/node-output-instance.dto';
import { NodeInstance } from '../../domain/node/instance/node-instance';
import { Injectable } from '@nestjs/common';
import { AvailableNodeService } from '../../core/service/available-node.service';
import { NodeInstanceDto } from '../dto/node-instance.dto';
import { NodeAttributeInstance } from '../../domain/node/instance/node-attribute-instance';
import { NodeAttributeDto } from '../dto/node-attribute.dto';

@Injectable()
export class AttributeDtoMapper {
  constructor(private availableNodeService: AvailableNodeService) {}

  dtoToAttribute(
    dto: NodeAttributeDto,
    instance: NodeInstance,
  ): NodeAttributeInstance {
    const attributeDefinition = instance.definition.attributes.find(
      (attrDefinition) => dto.identifier === attrDefinition.identifier,
    );
    const attributeInstance = attributeDefinition.createInstance(instance);
    attributeInstance.value = dto.value;
    return attributeInstance;
  }

  attributeToDto(node: NodeAttributeInstance): NodeAttributeDto {
    return {
      identifier: node.identifier,
      value: node.value,
    };
  }
}
