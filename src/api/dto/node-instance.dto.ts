import { ApiProperty } from '@nestjs/swagger';
import { NodeAttributeDto } from './node-attribute.dto';
import { NodeInputInstanceDto } from './node-input-instance.dto';
import { NodeOutputInstanceDto } from './node-output-instance.dto';
import { Position } from '../../graphic/position.interface';
import { NodeInputDefinitionDto } from './node-input-definition.dto';
import { NodeOutputDefinitionDto } from './node-output-definition.dto';

export class NodeInstanceDto implements Position {
  @ApiProperty()
  identifier: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  definitionId: string;
  @ApiProperty({ type: NodeAttributeDto, isArray: true, required: false })
  attributes: NodeAttributeDto[];

  @ApiProperty({ type: NodeInputInstanceDto, isArray: true, required: false })
  inputs: NodeInputDefinitionDto[];

  @ApiProperty({ type: NodeOutputInstanceDto, isArray: true, required: false })
  outputs: NodeOutputDefinitionDto[];

  @ApiProperty({ required: false })
  x: number;
  @ApiProperty({ required: false })
  y: number;
}
