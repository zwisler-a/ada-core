import { NodeProvider } from './node-provider.interface';

export interface Connector {
  name: string;
  description: string;
  nodeProvider?: NodeProvider;
}
