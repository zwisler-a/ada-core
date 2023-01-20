import { ApiProperty } from '@nestjs/swagger';

export class NodeOutputDefinitionDto {
  @ApiProperty()
  identifier: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
}
