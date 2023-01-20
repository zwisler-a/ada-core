import { Injectable, Logger } from '@nestjs/common';
import { ConnectorService } from './connector.service';
import { NodeDefinition } from '../../domain/node/definition/node-definition';

@Injectable()
export class AvailableNodeService {
  private readonly logger = new Logger(AvailableNodeService.name);

  constructor(private externalServiceService: ConnectorService) {}

  getAvailableNodes(): Promise<NodeDefinition[]> {
    return Promise.all(
      this.externalServiceService
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
