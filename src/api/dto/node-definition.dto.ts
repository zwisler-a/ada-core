import { ApiProperty } from '@nestjs/swagger';
import { NodeInputDefinitionDto } from './node-input-definition.dto';
import { NodeOutputDefinitionDto } from './node-output-definition.dto';
import { NodeAttributeDefinitionDto } from './node-attribute-definition.dto';

export class NodeDefinitionDto {
  @ApiProperty()
  identifier: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty({ type: NodeInputDefinitionDto, isArray: true })
  inputs: NodeInputDefinitionDto[];
  @ApiProperty({ type: NodeOutputDefinitionDto, isArray: true })
  outputs: NodeOutputDefinitionDto[];
  @ApiProperty({ type: NodeAttributeDefinitionDto, isArray: true })
  attributes: NodeAttributeDefinitionDto[];
}
