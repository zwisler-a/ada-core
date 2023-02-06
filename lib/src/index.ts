import { AmqpService } from './service/amqp.service';
import { RemoteApiService } from './service/remote-api.service';
import { NodeRegisterService } from './service/node-register.service';
import { ConsoleLogger, Logger } from './logger';

export * from './events/index';
export * from './domain/index';
export * from './logger';

export interface AdaLibConfiguration {
  logger?: Logger;
  amqpUrl: string;
}

export async function setup({
  logger = new ConsoleLogger(),
  amqpUrl,
}: AdaLibConfiguration) {
  const amqp = new AmqpService();
  await amqp.initialize(amqpUrl);
  const apiService = new RemoteApiService(amqp);
  const nodeRegisterer = new NodeRegisterService(amqp, apiService);
  await amqp.ready;
  return nodeRegisterer;
}
