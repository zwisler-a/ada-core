import { ApiProperty } from '@nestjs/swagger';

export class DeviceNameDto {
  @ApiProperty()
  defaultNames: string[];
  @ApiProperty()
  name: string;
  @ApiProperty()
  nicknames: string[];
}

export class DeviceInfoDto {
  @ApiProperty()
  manufacturer: string;
  @ApiProperty()
  model: string;
  @ApiProperty()
  hwVersion: string;
  @ApiProperty()
  swVersion: string;
}

export class OtherDeviceIdsDto {
  @ApiProperty()
  agentId?: string;
  @ApiProperty()
  deviceId: string;
}

export class GoogleDeviceDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  type: string;
  @ApiProperty()
  traits: string[];
  @ApiProperty()
  name: DeviceNameDto;
  @ApiProperty()
  willReportState: boolean;
  @ApiProperty()
  deviceInfo?: DeviceInfoDto;
  @ApiProperty()
  attributes?: object;
  @ApiProperty()
  customData?: object;
  @ApiProperty()
  roomHint?: string;
  @ApiProperty()
  otherDeviceIds?: OtherDeviceIdsDto[];
}
