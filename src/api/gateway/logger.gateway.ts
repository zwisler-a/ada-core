import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { RetainingLogger } from '../../logger/logger';
import { Logger } from '@nestjs/common';
import { Subscription } from 'rxjs';

@WebSocketGateway({
  namespace: 'log',
  cors: {
    origin: '*',
  },
})
export class LoggerGateway {
  private readonly logger = new Logger(LoggerGateway.name);
  private subscriptions: { [key: string]: Subscription } = {};

  constructor(private retainingLogger: RetainingLogger) {}

  @SubscribeMessage('subscribe')
  subscribeToLog(@ConnectedSocket() client: Socket) {
    this.logger.debug('Subscribe client to logs!');
    this.subscriptions[client.id] = this.retainingLogger.log$.subscribe(
      (msg) => {
        client.emit('log', msg);
      },
    );
  }

  @SubscribeMessage('unsubscribe')
  unsubscribeToLog(@ConnectedSocket() client: Socket) {
    this.logger.debug('Unsubscribe client to logs!');
    this.subscriptions[client.id]?.unsubscribe();
  }
}
