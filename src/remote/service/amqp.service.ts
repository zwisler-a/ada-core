import { Injectable, Logger } from '@nestjs/common';
import * as amqplib from 'amqplib';
import { Subject } from 'rxjs';
import { ConnectorEvent } from '../events/connector.event';
import { IOEvent } from '../events/io.event';
import * as process from 'process';

@Injectable()
export class AmqpService {
  private logger = new Logger(AmqpService.name);
  private connectorExchange = 'smart.queue.connector';
  private ioExchange = 'smart.queue.io';

  private conn: any;
  private ioChannel: any;

  public connectors$ = new Subject<ConnectorEvent>();
  public ioEvents$ = new Subject<IOEvent>();
  private connectorChannel: any;

  async initialize() {
    this.conn = await amqplib.connect('amqp://' + process.env.RABBIT_HOST);

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
    this.logger.debug('ConnectorQueue:' + connectorQueue.queue);
    this.connectorChannel.bindQueue(
      connectorQueue.queue,
      this.connectorExchange,
      '',
    );
    this.connectorChannel.consume(
      connectorQueue.queue,
      this.connectorQueueCallback.bind(this),
    );

    this.ioChannel = await this.conn.createChannel();
    await this.ioChannel.assertExchange(this.ioExchange, 'fanout', {
      durable: false,
    });
    const ioQueue = await this.ioChannel.assertQueue('', { exclusive: true });
    this.ioChannel.bindQueue(ioQueue.queue, this.ioExchange, '');
    this.ioChannel.consume(ioQueue.queue, this.ioQueueCallback.bind(this));
  }

  private connectorQueueCallback(message) {
    try {
      this.connectors$.next(JSON.parse(message.content.toString()));
      this.connectorChannel.ack(message);
    } catch (e) {
      this.logger.error(`Failed to parse connector message`);
    }
  }

  private ioQueueCallback(message) {
    try {
      this.ioEvents$.next(JSON.parse(message.content.toString()));
      this.ioChannel.ack(message);
    } catch (e) {
      this.logger.error(`Failed to parse io message`);
    }
  }

  send(message: IOEvent) {
    this.ioChannel.publish(
      this.ioExchange,
      '',
      Buffer.from(JSON.stringify(message)),
    );
  }
}
