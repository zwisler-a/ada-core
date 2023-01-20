import { ApiProperty } from '@nestjs/swagger';
import { NodeOutputDefinitionDto } from './node-output-definition.dto';

export class NodeOutputInstanceDto {
  @ApiProperty()
  identifier: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  definition: NodeOutputDefinitionDto;
}
