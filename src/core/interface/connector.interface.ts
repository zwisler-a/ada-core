import { NodeProvider } from './provider/node-provider.interface';

export interface Connector {
  name: string;
  description: string;
  nodeProvider?: NodeProvider;
}
