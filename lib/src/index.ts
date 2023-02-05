import { AmqpService } from './service/amqp.service';
import { RemoteApiService } from './service/remote-api.service';
import { NodeRegisterService } from './service/node-register.service';

export * from './events/index';
export * from './domain/index';

export async function setup() {
  console.log('Initializing ADA');
  const amqp = new AmqpService();
  await amqp.initialize();
  console.log('Creating Services ...');
  const apiService = new RemoteApiService(amqp);
  const nodeRegisterer = new NodeRegisterService(amqp, apiService);
  await amqp.ready;
  return nodeRegisterer;
}
