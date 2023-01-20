import { ApiProperty } from '@nestjs/swagger';

export class EdgeDto {
  @ApiProperty()
  identifier: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  inputNodeIdentifier: string;
  @ApiProperty()
  outputNodeIdentifier: string;
  @ApiProperty()
  inputIdentifier: string;
  @ApiProperty()
  outputIdentifier: string;
}
