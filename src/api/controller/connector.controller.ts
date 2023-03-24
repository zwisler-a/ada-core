import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConnectorService } from '../../execution';
import { ConnectorDto } from '../dto/connector.dto';
import { ConnectorDtoMapper } from '../mapper/connector.mapper';

@ApiTags('Connector')
@Controller('/connectors')
export class ConnectorController {
  constructor(
    private connectorService: ConnectorService,
    private connectorMapper: ConnectorDtoMapper,
  ) {}

  @ApiOperation({ operationId: 'get-all-connectors' })
  @Get()
  async getAllConnectors(): Promise<ConnectorDto[]> {
    return this.connectorService
      .getAll()
      .map((connector) => this.connectorMapper.connectorToDto(connector));
  }
}
