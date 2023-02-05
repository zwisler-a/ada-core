import { AmqpService } from './amqp.service';
import { filter } from 'rxjs';
import {
  AttributeEvent,
  CreateInstanceEvent,
  IOEventType,
  OutputEvent,
} from '../events';

export class RemoteApiService {
  constructor(private amqp: AmqpService) {}

  createInstanceObservable(connectorId: string, instanceId: string) {
    return this.amqp.ioEvents$.pipe(
      filter(
        (io) =>
          io.connectorIdentifier === connectorId &&
          io.nodeInstanceIdentifier === instanceId,
      ),
    );
  }

  createInstanceCreateObservable(connectorId: string, definition: string) {
    return this.amqp.ioEvents$.pipe(
      filter((io) => io.type === IOEventType.CREATE),
      filter(
        (io: CreateInstanceEvent) =>
          io.connectorIdentifier === connectorId &&
          io.definitionIdentifier === definition,
      ),
    );
  }

  updateOutput(
    connectorIdentifier: string,
    nodeInstanceIdentifier: string,
    outputIdentifier: string,
    data: string,
  ) {
    const event: OutputEvent = {
      type: IOEventType.OUTPUT,
      connectorIdentifier,
      nodeInstanceIdentifier,
      outputIdentifier,
      value: data,
    };
    this.amqp.sendIO(event);
  }

  updateAttribute(
    connectorIdentifier: string,
    nodeInstanceIdentifier: string,
    attributeIdentifier: string,
    data: string,
  ) {
    const event: AttributeEvent = {
      type: IOEventType.ATTRIBUTE,
      connectorIdentifier,
      nodeInstanceIdentifier,
      attributeIdentifier,
      value: data,
    };
    this.amqp.sendIO(event);
  }
}
