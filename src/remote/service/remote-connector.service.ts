import { Injectable } from '@nestjs/common';
import { NodeProvider } from '../../core/interface/node-provider.interface';
import { NodeDefinition } from '../../domain';
import { RemoteApiService } from './remote-api.service';

@Injectable()
export class RemoteConnectorService implements NodeProvider {
  constructor(private api: RemoteApiService) {}

  async getAvailableNodes(): Promise<NodeDefinition[]> {
    return [];
  }
}
