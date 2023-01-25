import { Injectable } from '@nestjs/common';
import { RemoteConnectorDto } from '../dto/remote-connector.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RemoteConnectorEntity } from '../persistance/remote-connector.entity';
import { Repository } from 'typeorm';
import { NodeProvider } from '../../core/interface/node-provider.interface';
import { NodeDefinition } from '../../domain/node/definition/node-definition';
import { RemoteConnectorMapper } from '../mapper/remote-connector.mapper';
import { RemoteApiService } from './remote-api.service';
import { RemoteNode } from '../node/remote-node';

@Injectable()
export class RemoteConnectorService implements NodeProvider {
  constructor(
    @InjectRepository(RemoteConnectorEntity)
    private repo: Repository<RemoteConnectorEntity>,
    private mapper: RemoteConnectorMapper,
    private api: RemoteApiService,
  ) {}

  async getAvailable() {
    const connectors = await this.repo.find();
    return connectors.map((con) => this.mapper.toDto(con));
  }

  async addConnector(connector: RemoteConnectorDto) {
    return this.repo.save(this.mapper.toEntity(connector));
  }

  async getAvailableNodes(): Promise<NodeDefinition[]> {
    const connectors = await this.repo.find();
    const nodes = await Promise.all(
      connectors.map(async (connector) => {
        return (await this.api.getAvailableNodes(connector)).map(
          (node) => new RemoteNode(node, connector.url, this.api),
        );
      }),
    );
    return nodes.flatMap((a) => a);
  }
}
