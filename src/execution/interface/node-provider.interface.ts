import { NodeDefinition } from '@zwisler/ada-lib';

export interface NodeProvider {
  getAvailableNodes(): Promise<NodeDefinition[]>;
}
