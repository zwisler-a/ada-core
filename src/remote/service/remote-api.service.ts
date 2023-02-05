import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { AmqpService } from './amqp.service';
import {
  AttributeEvent,
  CreateInstanceEvent,
  DestroyInstanceEvent,
  InputEvent,
  IOEventType,
} from '@ada/lib';
import { filter } from 'rxjs';

@Injectable()
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

  async createInstance(
    connectorIdentifier: string,
    definitionIdentifier: string,
    state: { [attributeId: string]: any },
  ) {
    const instanceId = uuidv4();
    const event: CreateInstanceEvent = {
      type: IOEventType.CREATE,
      connectorIdentifier,
      definitionIdentifier,
      nodeInstanceIdentifier: instanceId,
      state,
    };
    this.amqp.send(event);
    return instanceId;
  }

  destroyInstance(connectorIdentifier: string, nodeInstanceIdentifier: string) {
    const event: DestroyInstanceEvent = {
      type: IOEventType.DESTROY,
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
      type: IOEventType.INPUT,
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
      type: IOEventType.ATTRIBUTE,
      connectorIdentifier,
      nodeInstanceIdentifier,
      attributeIdentifier,
      value: data,
    };
    this.amqp.send(event);
  }
}
