import { Injectable, Logger } from '@nestjs/common';
import { ConnectorService } from './connector.service';
import { NodeDefinition } from '@zwisler/ada-lib';

@Injectable()
export class AvailableNodeService {
  private readonly logger = new Logger(AvailableNodeService.name);

  constructor(private connectorService: ConnectorService) {}

  getAvailableNodes(): Promise<NodeDefinition[]> {
    return Promise.all(
      this.connectorService
        .getAll()
        .filter((service) => !!service.nodeProvider)
        .map((service) => service.nodeProvider.getAvailableNodes()),
    ).then((arr) => arr.flatMap((device) => device));
  }

  async getByIdentifier(identifier) {
    const nodes = await this.getAvailableNodes();
    return nodes.find((node) => node.identifier === identifier);
  }
}
