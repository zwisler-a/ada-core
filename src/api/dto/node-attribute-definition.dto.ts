import { ApiProperty } from '@nestjs/swagger';

export class NodeAttributeDefinitionDto {
  @ApiProperty()
  identifier: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
}
