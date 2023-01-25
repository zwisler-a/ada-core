import { Injectable } from '@nestjs/common';
import { RemoteConnectorEntity } from '../persistance/remote-connector.entity';
import { RemoteConnectorDto } from '../dto/remote-connector.dto';

@Injectable()
export class RemoteConnectorMapper {
  toDto(connector: RemoteConnectorEntity): RemoteConnectorDto {
    return {
      url: connector.url,
      name: connector.name,
      description: connector.description,
    };
  }

  toEntity(connector: RemoteConnectorDto): RemoteConnectorEntity {
    const entity = new RemoteConnectorEntity();
    entity.name = connector.name;
    entity.description = connector.description;
    entity.url = connector.url;
    return entity;
  }
}
