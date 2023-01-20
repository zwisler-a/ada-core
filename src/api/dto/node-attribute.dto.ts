import { ApiProperty } from '@nestjs/swagger';

export class NodeAttributeDto {
  @ApiProperty()
  identifier: string;
  @ApiProperty()
  value: any;
}
