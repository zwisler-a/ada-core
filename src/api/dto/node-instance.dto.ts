import { ApiProperty } from '@nestjs/swagger';
import { NodeAttributeDto } from './node-attribute.dto';

export class NodeInstanceDto {
  @ApiProperty()
  identifier: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  definitionId: string;
  @ApiProperty({ type: NodeAttributeDto, isArray: true })
  attributes: NodeAttributeDto[];
}
