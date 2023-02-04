import { AmqpService } from './service/amqp.service';
import { RemoteApiService } from './service/remote-api.service';
import { NodeRegisterService } from './service/node-register.service';

export * from './events/index';

export async function setup() {
  const amqp = new AmqpService();
  const apiService = new RemoteApiService(amqp);
  const nodeRegisterer = new NodeRegisterService(amqp, apiService);
  await amqp.ready;
  return nodeRegisterer;
}
