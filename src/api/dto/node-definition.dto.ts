import { ApiProperty } from '@nestjs/swagger';
import { NodeInputDefinitionDto } from './node-input-definition.dto';
import { NodeOutputDefinitionDto } from './node-output-definition.dto';

export class NodeDefinitionDto {
  @ApiProperty()
  identifier: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty({ type: NodeInputDefinitionDto })
  inputs: NodeInputDefinitionDto[];
  @ApiProperty({ type: NodeOutputDefinitionDto })
  outputs: NodeOutputDefinitionDto[];
}
