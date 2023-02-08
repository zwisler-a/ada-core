import { AmqpService } from './amqp.service';
import { ConnectorEvent } from '../events';
import { NodeDefinition } from '../domain';
import { Logger } from '../logger';
import { InstanceManagerService } from './instance-manager.service';

export class NodeRegisterService {
  private healthPingIntervalRef: any;

  constructor(
    private logger: Logger,
    private amqp: AmqpService,
    private instanceManager: InstanceManagerService,
  ) {}

  close() {
    this.amqp.close();
  }

  async register(
    nodes: NodeDefinition[],
    connectorId: string,
    name: string,
    description: string,
  ) {
    await this.amqp.ready;
    this.logger.log(`Registering Connector ${connectorId} - ${name}`);
    nodes.forEach((node) => {
      this.instanceManager.watchForInstantiation(connectorId, node);
    });
    if (this.healthPingIntervalRef) clearInterval(this.healthPingIntervalRef);
    this.healthPingIntervalRef = setInterval(() => {
      this.sendConnectorUpdate(connectorId, name, description, nodes);
    }, 5000);
  }

  private sendConnectorUpdate(
    connectorId: string,
    name: string,
    description: string,
    nodes: NodeDefinition[],
  ) {
    const message: ConnectorEvent = {
      identifier: connectorId,
      name,
      description,
      nodes: nodes.map((node) => ({
        name: node.name,
        description: node.description,
        identifier: node.identifier,
        attributes: node.attributes,
        inputs: node.inputs,
        outputs: node.outputs,
      })),
    };
    this.amqp.sendConnector(message);
  }
}
