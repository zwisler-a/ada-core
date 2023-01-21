import { ApiProperty } from '@nestjs/swagger';
import { NodeAttributeDto } from './node-attribute.dto';
import { NodeInputInstanceDto } from './node-input-instance.dto';
import { NodeOutputInstanceDto } from './node-output-instance.dto';

export class NodeInstanceDto {
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
  inputs: NodeInputInstanceDto[];

  @ApiProperty({ type: NodeOutputInstanceDto, isArray: true, required: false })
  outputs: NodeOutputInstanceDto[];
}
