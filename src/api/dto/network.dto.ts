import { ApiProperty } from '@nestjs/swagger';
import { EdgeDto } from './edge.dto';
import { NodeInstanceDto } from './node-instance.dto';

export class NetworkDto {
  @ApiProperty({ readOnly: true })
  active: boolean;
  @ApiProperty()
  identifier: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty({ type: NodeInstanceDto, isArray: true })
  nodes: NodeInstanceDto[];
  @ApiProperty({ type: EdgeDto, isArray: true })
  edges: EdgeDto[];
}
