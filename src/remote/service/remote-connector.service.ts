import { Injectable, Logger } from '@nestjs/common';
import { AmqpService } from './amqp.service';
import { RemoteConnectorNodeManagerService } from './remote-connector-node-manager.service';
import { ConnectorHealthService } from './connector-health.service';

@Injectable()
export class RemoteConnectorService {
  private logger = new Logger(RemoteConnectorService.name);

  constructor(
    private amqp: AmqpService,
    private nodeManager: RemoteConnectorNodeManagerService,
    private healthService: ConnectorHealthService,
  ) {
    this.subscribeToConnectorUpdate();
  }

  private subscribeToConnectorUpdate() {
    this.amqp.connectors$.subscribe((connector) => {
      if (this.nodeManager.hasRegistered(connector.identifier)) {
        this.healthService.healthPing(connector.identifier);
      } else {
        this.nodeManager.register(
          connector.identifier,
          connector.name,
          connector.description,
          connector.nodes,
        );
        this.healthService.healthPing(connector.identifier);
      }
    });
  }
}
