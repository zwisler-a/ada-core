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
import { AvailableNodeService } from '../../execution/service/available-node.service';
import { NodeInstanceDto } from '../dto/node-instance.dto';
import { AttributeDtoMapper } from './attribute.mapper';
import { NodeAttributeDefinition } from '../../domain/node/definition/node-attribute-definition';
import { NodeAttributeDefinitionDto } from '../dto/node-attribute-definition.dto';
import { Position } from '../../graphic/position.interface';
import { NodeRepresentation } from '../../persistance';

@Injectable()
export class NodeDtoMapper {
  constructor(
    private availableNodeService: AvailableNodeService,
    private attributeMapper: AttributeDtoMapper,
  ) {}

  async dtoToNode(dto: NodeInstanceDto): Promise<NodeRepresentation> {
    const nodeDefinition = await this.availableNodeService.getByIdentifier(
      dto.definitionId,
    );
    if (!nodeDefinition) throw new Error('Node definition is not available!');

    const instance = new NodeRepresentation();
    instance.id = dto.identifier;
    instance.name = dto.name;
    instance.definitionId = dto.definitionId;
    instance.description = dto.description;
    instance.attributes =
      dto.attributes?.map((dto) => this.attributeMapper.dtoToAttribute(dto)) ??
      [];
    return instance;
  }

  async nodeToDto(
    node: NodeRepresentation,
    position: Position,
  ): Promise<NodeInstanceDto> {
    const definition = await this.availableNodeService.getByIdentifier(
      node.definitionId,
    );
    const findAttributeDef = (id: string) =>
      definition?.attributes.find((attr) => attr.identifier === id);
    return {
      identifier: node.id,
      name: node.name,
      description: node.description,
      definitionId: node.definitionId,
      attributes: node.attributes.map((attribute) =>
        this.attributeMapper.attributeToDto(
          attribute,
          findAttributeDef(attribute.attributeDefinitionId),
        ),
      ),
      inputs: definition?.inputs.map((i) => this.nodeInputDefinitionToDto(i)),
      outputs: definition?.outputs.map((o) =>
        this.nodeOutputDefinitionToDto(o),
      ),
      x: position?.x,
      y: position?.y,
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
}
