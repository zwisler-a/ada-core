import { ApiProperty } from '@nestjs/swagger';

export class ConnectorDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
}
