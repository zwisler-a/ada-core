import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RemoteConnectorService } from '../service/remote-connector.service';
import { RemoteConnectorDto } from '../dto/remote-connector.dto';

@ApiTags('Remote connector')
@Controller('/remote')
export class ConnectorController {
  constructor(private remoteService: RemoteConnectorService) {}

  @Get()
  async getAllConnectors(): Promise<RemoteConnectorDto[]> {
    return this.remoteService.getAvailable();
  }

  @Post()
  async addRemoteConnector(
    @Body() connector: RemoteConnectorDto,
  ): Promise<RemoteConnectorDto> {
    return this.remoteService.addConnector(connector);
  }
}
