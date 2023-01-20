import { ApiProperty } from '@nestjs/swagger';

export class NodeInputDefinitionDto {
  @ApiProperty()
  identifier: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
}
