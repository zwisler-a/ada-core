import { Injectable, Logger } from '@nestjs/common';
import { ServerRemoteNodeDefinition } from '../node/server-remote-node-definition';
import { AmqpService } from './amqp.service';
import { ConnectorService } from '../../execution';
import { RemoteApiService } from './remote-api.service';
import { Connector } from '../../execution/interface/connector.interface';

@Injectable()
export class RemoteConnectorService {
  private logger = new Logger(RemoteConnectorService.name);
  private connectors: {
    [connectorId: string]: {
      connector: Connector;
      last: number;
      nodes: ServerRemoteNodeDefinition[];
    };
  } = {};

  constructor(
    private amqp: AmqpService,
    private connectorService: ConnectorService,
    private apiService: RemoteApiService,
  ) {
    setInterval(this.checkHealth.bind(this), 10000);
    this.subscribeToConnectorUpdate();
  }

  private subscribeToConnectorUpdate() {
    this.amqp.connectors$.subscribe((connector) => {
      if (!this.connectors[connector.identifier]) {
        this.logger.debug(`New remote connector registered ${connector.name}.`);
      }
      const nodes = connector.nodes.map(
        (node) =>
          new ServerRemoteNodeDefinition(
            node,
            connector.identifier,
            this.apiService,
          ),
      );
      const con: Connector = {
        name: connector.name,
        description: connector.description,
        nodeProvider: {
          getAvailableNodes: async () => {
            return nodes;
          },
        },
      };
      this.connectors[connector.identifier] = {
        connector: con,
        nodes,
        last: new Date().getTime(),
      };
      this.connectorService.updateConnector(con);
    });
  }

  private timeoutConnector(connectorId: string) {
    this.connectorService.remove(this.connectors[connectorId].connector);
    this.connectors[connectorId].nodes.forEach((node) =>
      node.connectorTimeout(),
    );
    delete this.connectors[connectorId];
  }

  private checkHealth() {
    Object.keys(this.connectors).forEach((connectorId) => {
      if (
        this.connectors[connectorId].last <
        new Date().getTime() - 1000 * 30
      ) {
        this.timeoutConnector(connectorId);
      }
    });
  }
}
