import { Injectable, Logger } from '@nestjs/common';
import { RemoteNodeDefinition } from '@zwisler/ada-lib/src';
import { ServerNodeHolderDefinition } from '../node/server-node-holder-definition';
import { ServerRemoteNodeDefinition } from '../node/server-remote-node-definition';
import { RemoteNodeApiService } from './remote-node-api.service';
import { ConnectorService } from '../../execution';

@Injectable()
export class RemoteConnectorNodeManagerService {
  private logger = new Logger(RemoteConnectorNodeManagerService.name);
  private connectors: { [key: string]: ServerNodeHolderDefinition[] } = {};

  constructor(
    private remoteNodeApi: RemoteNodeApiService,
    private connectorService: ConnectorService,
  ) {}

  register(
    connectorId: string,
    name: string,
    description: string,
    remoteNodes: RemoteNodeDefinition[],
  ) {
    if (this.connectors[connectorId]) {
      return this.reconnect(connectorId, name, description, remoteNodes);
    }
    this.connectors[connectorId] = remoteNodes.map((node) =>
      this.createNode(connectorId, node),
    );
    this.logger.debug(
      `Registered connector ${connectorId} with nodes [${this.connectors[
        connectorId
      ]
        .map((node) => node.name)
        .join(',')}]`,
    );
    this.connectorService.register({
      identifier: connectorId,
      name,
      description,
      nodeProvider: {
        getAvailableNodes: async () => this.connectors[connectorId],
      },
    });
  }

  timeoutConnector(connectorId: string) {
    if (!this.connectors[connectorId]) return;
    this.connectors[connectorId] = this.connectors[connectorId].filter(
      (node) => {
        if (node.isInUse()) {
          this.logger.debug(
            `Disconnected node but kept holder for ${node.identifier} - ${node.name}`,
          );
          node.disconnect();
          return true;
        }
        this.logger.debug(`Removed node ${node.identifier} - ${node.name}`);
        return false;
      },
    );
    this.connectorService.remove(connectorId);
    if (!this.connectors[connectorId].some((node) => node.isInUse()))
      delete this.connectors[connectorId];
  }

  private reconnect(
    connectorId: string,
    name: string,
    description: string,
    remoteNodes: RemoteNodeDefinition[],
  ) {
    this.logger.debug(`Attempting reconnect for ${connectorId}!`);
    const existingNodes = this.connectors[connectorId];
    this.connectors[connectorId] = remoteNodes.map((remoteNode) => {
      const def = new ServerRemoteNodeDefinition(
        remoteNode,
        connectorId,
        this.remoteNodeApi,
      );
      const existingNode = existingNodes.find(
        (en) => en.identifier === remoteNode.identifier,
      );
      if (existingNode) {
        this.logger.debug(
          `Reconnecting nodes from definition ${def.identifier} - ${def.name}`,
        );
        existingNode.reconnect();
        return existingNode;
      } else {
        return new ServerNodeHolderDefinition(def);
      }
    });
    this.connectorService.register({
      identifier: connectorId,
      name,
      description,
      nodeProvider: {
        getAvailableNodes: async () => this.connectors[connectorId],
      },
    });
  }

  hasRegistered(connectorId: string) {
    return (
      !!this.connectors[connectorId] &&
      !this.connectors[connectorId].some((node) => node.disconnected())
    );
  }

  private createNode(connectorId: string, remoteNode: RemoteNodeDefinition) {
    const nodeDefinition = new ServerRemoteNodeDefinition(
      remoteNode,
      connectorId,
      this.remoteNodeApi,
    );
    return new ServerNodeHolderDefinition(nodeDefinition);
  }
}
