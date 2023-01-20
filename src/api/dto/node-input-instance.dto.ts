import { ApiProperty } from '@nestjs/swagger';
import { NodeInputDefinitionDto } from './node-input-definition.dto';

export class NodeInputInstanceDto {
  @ApiProperty()
  identifier: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  definition: NodeInputDefinitionDto;
}
