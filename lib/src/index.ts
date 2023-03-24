import { AmqpService } from './service/amqp.service';
import { RemoteApiService } from './service/remote-api.service';
import { NodeRegisterService } from './service/node-register.service';
import { ConsoleLogger, Logger } from './logger';
import { InstanceManagerService } from './service/instance-manager.service';

export * from './proxy';
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
  const amqp = new AmqpService(logger);
  await amqp.initialize(amqpUrl);
  const apiService = new RemoteApiService(logger, amqp);
  const instanceManager = new InstanceManagerService(logger, apiService);
  const nodeRegisterer = new NodeRegisterService(logger, amqp, instanceManager);
  await amqp.ready;
  return nodeRegisterer;
}
