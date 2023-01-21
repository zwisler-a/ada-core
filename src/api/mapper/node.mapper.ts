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
import { AttributeDtoMapper } from './attribute.mapper';
import { NodeAttributeDefinition } from '../../domain/node/definition/node-attribute-definition';
import { NodeAttributeDefinitionDto } from '../dto/node-attribute-definition.dto';

@Injectable()
export class NodeDtoMapper {
  constructor(
    private availableNodeService: AvailableNodeService,
    private attributeMapper: AttributeDtoMapper,
  ) {}

  async dtoToNode(dto: NodeInstanceDto): Promise<NodeInstance> {
    const nodeDefinition = await this.availableNodeService.getByIdentifier(
      dto.definitionId,
    );
    if (!nodeDefinition) throw new Error('Node definition is not available!');

    const instance = nodeDefinition.createInstance();
    instance.identifier = dto.identifier;
    instance.name = dto.name;
    instance.description = dto.description;
    instance.attributes =
      dto.attributes?.map((dto) =>
        this.attributeMapper.dtoToAttribute(dto, instance),
      ) ?? instance.attributes;
    return instance;
  }

  nodeInstanceToDto(node: NodeInstance): NodeInstanceDto {
    return {
      identifier: node.identifier,
      name: node.name,
      description: node.description,
      definitionId: node.definition.identifier,
      attributes: node.attributes.map((attribute) =>
        this.attributeMapper.attributeToDto(attribute),
      ),
      inputs: node.inputs.map((i) => this.nodeInputInstanceToDto(i)),
      outputs: node.outputs.map((o) => this.nodeOutputInstanceToDto(o)),
    };
  }

  nodeDefinitionToDto(node: NodeDefinition): NodeDefinitionDto {
    const inputs = node.inputs;
    const outputs = node.outputs;

    return {
      identifier: node.identifier,
      name: node.name,
      description: node.description,
      inputs: inputs.map(this.nodeInputDefinitionToDto),
      outputs: outputs.map(this.nodeOutputDefinitionToDto),
      attributes: node.attributes?.map(this.nodeAttributeDefinitionToDto),
    };
  }

  nodeInputDefinitionToDto(input: NodeInputDefinition): NodeInputDefinitionDto {
    return {
      identifier: input.identifier,
      name: input.name,
      description: input.description,
    };
  }

  nodeOutputDefinitionToDto(
    input: NodeOutputDefinition,
  ): NodeOutputDefinitionDto {
    return {
      identifier: input.identifier,
      name: input.name,
      description: input.description,
    };
  }

  nodeAttributeDefinitionToDto(
    attribute: NodeAttributeDefinition,
  ): NodeAttributeDefinitionDto {
    return {
      identifier: attribute.identifier,
      name: attribute.name,
      description: attribute.description,
    };
  }

  nodeInputInstanceToDto(input: NodeInputInstance): NodeInputInstanceDto {
    return {
      identifier: input.identifier,
      name: input.name,
      description: input.description,
      definition: this.nodeInputDefinitionToDto(input.definition),
    };
  }

  nodeOutputInstanceToDto(output: NodeOutputInstance): NodeOutputInstanceDto {
    return {
      identifier: output.identifier,
      name: output.name,
      description: output.description,
      definition: this.nodeOutputDefinitionToDto(output.definition),
    };
  }
}
