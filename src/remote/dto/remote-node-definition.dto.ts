import { NodeInputDefinition } from '../../domain/node/definition/node-input-definition';
import { NodeOutputDefinition } from '../../domain/node/definition/node-output-definition';
import { NodeAttributeDefinition } from '../../domain/node/definition/node-attribute-definition';
import { ApiProperty } from '@nestjs/swagger';

export class RemoteNodeDefinitionDto {
  @ApiProperty()
  identifier: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty({ type: NodeInputDefinition, isArray: true })
  inputs: NodeInputDefinition[];
  @ApiProperty({ type: NodeOutputDefinition, isArray: true })
  outputs: NodeOutputDefinition[];
  @ApiProperty({ type: NodeAttributeDefinition, isArray: true })
  attributes: NodeAttributeDefinition[];
}
