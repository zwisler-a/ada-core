import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RemoteNodeDefinitionDto } from '../dto/remote-node-definition.dto';
import { RemoteConnectorEntity } from '../persistance/remote-connector.entity';
import { RemoteInstanceDto } from '../dto/remote-instance.dto';
import { RemoteNodeOutputUpdateDto } from '../dto/remote-node-output-update.dto';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class RemoteApiService {
  constructor(private http: HttpService) {}

  async getAvailableNodes(connector: RemoteConnectorEntity) {
    return firstValueFrom(
      this.http
        .get<RemoteNodeDefinitionDto[]>(connector.url)
        .pipe(map((res) => res.data)),
    );
  }

  async createInstance(connectorUrl: string) {
    return firstValueFrom(
      this.http
        .post<RemoteInstanceDto>(connectorUrl + '/create-instance')
        .pipe(map((response) => response.data)),
    );
  }

  async updateInput(
    connectorUrl: string,
    nodeIdentifier: string,
    inputIdentifier: string,
    data: string,
  ) {
    return firstValueFrom(
      this.http
        .post<RemoteNodeOutputUpdateDto[]>(connectorUrl + '/update-input', {
          nodeIdentifier,
          inputIdentifier,
          data,
        })
        .pipe(map((response) => response.data)),
    );
  }

  async updateAttribute(
    connectorUrl: string,
    attributeIdentifier: string,
    data: string,
  ) {
    return this.http
      .post<RemoteInstanceDto>(connectorUrl + '/update-attribute', {
        attributeIdentifier,
        data,
      })
      .pipe(map((response) => response.data));
  }
}
