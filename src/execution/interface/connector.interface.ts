import { NodeProvider } from './node-provider.interface';

export interface Connector {
  identifier: string;
  name: string;
  description: string;
  nodeProvider?: NodeProvider;
}
