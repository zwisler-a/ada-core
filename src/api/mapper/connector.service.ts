import { Injectable } from '@nestjs/common';
import { Connector } from '../../core/interface/connector.interface';
import { ConnectorDto } from '../dto/connector.dto';

@Injectable()
export class ConnectorDtoMapper {
  connectorToDto(connector: Connector): ConnectorDto {
    const dto = new ConnectorDto();
    dto.name = connector.name;
    dto.description = connector.description;
    return dto;
  }
}
