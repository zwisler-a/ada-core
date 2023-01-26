import { ApiProperty } from '@nestjs/swagger';

export class NodeAttributeDto {
  @ApiProperty()
  identifier: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  definitionId: string;
  @ApiProperty()
  value: any;
}
