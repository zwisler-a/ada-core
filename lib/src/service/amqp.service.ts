import * as amqplib from 'amqplib';
import { ConnectorEvent, IOEvent } from '../events';
import { Subject } from 'rxjs';
import { NodeDefinition } from '../domain';

export class AmqpService {
  private connectorExchange = 'smart.queue.connector';
  private ioExchange = 'smart.queue.io';

  private conn: any;
  private ioChannel: any;

  public ioEvents$ = new Subject<IOEvent>();
  private connectorChannel: any;

  private resolve: (v: any) => void;
  ready: Promise<any> = new Promise((res) => {
    this.resolve = res;
  });

  async initialize() {
    this.conn = await amqplib.connect('amqp://localhost');

    this.connectorChannel = await this.conn.createChannel();
    await this.connectorChannel.assertExchange(
      this.connectorExchange,
      'fanout',
      {
        durable: false,
      },
    );
    const connectorQueue = await this.connectorChannel.assertQueue('', {
      exclusive: true,
    });
    this.connectorChannel.bindQueue(
      connectorQueue.queue,
      this.connectorExchange,
      '',
    );

    this.ioChannel = await this.conn.createChannel();
    await this.ioChannel.assertExchange(this.ioExchange, 'fanout', {
      durable: false,
    });
    const ioQueue = await this.ioChannel.assertQueue('', { exclusive: true });
    this.ioChannel.bindQueue(ioQueue.queue, this.ioExchange, '');
    this.ioChannel.consume(ioQueue.queue, this.ioQueueCallback.bind(this));
    console.log('Connection established');
    this.resolve(null);
  }

  private ioQueueCallback(message) {
    try {
      this.ioEvents$.next(JSON.parse(message.content.toString()));
      this.ioChannel.ack(message);
    } catch (e) {}
  }

  sendIO(message: IOEvent) {
    this.ioChannel.publish(
      this.ioExchange,
      '',
      Buffer.from(JSON.stringify(message)),
    );
  }

  sendConnector(
    identifier: string,
    name: string,
    description: string,
    nodes: NodeDefinition[],
  ) {
    const message: ConnectorEvent = {
      identifier,
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
    this.connectorChannel.publish(
      this.connectorExchange,
      '',
      Buffer.from(JSON.stringify(message)),
    );
  }
}
