import { NodeDefinition } from '@ada/lib';

export interface NodeProvider {
  getAvailableNodes(): Promise<NodeDefinition[]>;
}
