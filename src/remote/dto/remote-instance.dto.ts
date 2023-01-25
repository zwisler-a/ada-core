import { ApiProperty } from '@nestjs/swagger';

export class RemoteInstanceDto {
  @ApiProperty()
  identifier: string;
}
