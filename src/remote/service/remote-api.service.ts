import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { AmqpService } from './amqp.service';
import { CreateInstanceEvent } from '../events/create-instance.event';
import { RemoteNode } from '../node/remote-node';
import { InputEvent } from '../events/input.event';
import { AttributeEvent } from '../events/attribute.event';
import { DestroyInstanceEvent } from '../events/destroy-instance.event';
import { filter } from 'rxjs';
import { ConnectorService } from '../../execution';

@Injectable()
export class RemoteApiService {
  constructor(
    private amqp: AmqpService,
    private connectorService: ConnectorService,
  ) {
    this.subscribeToConnectorUpdate();
  }

  createInstanceObservable(connectorId: string, instanceId: string) {
    return this.amqp.ioEvents$.pipe(
      filter(
        (io) =>
          io.connectorIdentifier === connectorId &&
          io.nodeInstanceIdentifier === instanceId,
      ),
    );
  }

  private subscribeToConnectorUpdate() {
    this.amqp.connectors$.subscribe((connector) => {
      this.connectorService.updateConnector({
        name: connector.name,
        description: connector.description,
        nodeProvider: {
          getAvailableNodes: async () => {
            return connector.nodes.map(
              (node) => new RemoteNode(node, connector.identifier, this),
            );
          },
        },
      });
    });
  }

  async createInstance(
    connectorIdentifier: string,
    definitionIdentifier: string,
  ) {
    const instanceId = uuidv4();
    const event: CreateInstanceEvent = {
      type: 'CREATE',
      connectorIdentifier,
      definitionIdentifier,
      nodeInstanceIdentifier: instanceId,
    };
    this.amqp.send(event);
    return instanceId;
  }

  destroyInstance(connectorIdentifier: string, nodeInstanceIdentifier: string) {
    const event: DestroyInstanceEvent = {
      type: 'DESTROY',
      connectorIdentifier,
      nodeInstanceIdentifier,
    };
    this.amqp.send(event);
  }

  updateInput(
    connectorIdentifier: string,
    nodeInstanceIdentifier: string,
    inputIdentifier: string,
    data: string,
  ) {
    const event: InputEvent = {
      type: 'INPUT',
      connectorIdentifier,
      nodeInstanceIdentifier,
      inputIdentifier,
      value: data,
    };
    this.amqp.send(event);
  }

  updateAttribute(
    connectorIdentifier: string,
    nodeInstanceIdentifier: string,
    attributeIdentifier: string,
    data: string,
  ) {
    const event: AttributeEvent = {
      type: 'ATTRIBUTE',
      connectorIdentifier,
      nodeInstanceIdentifier,
      attributeIdentifier,
      value: data,
    };
    this.amqp.send(event);
  }
}
