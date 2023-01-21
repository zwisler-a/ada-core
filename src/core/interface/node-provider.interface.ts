import { NodeDefinition } from '../../domain/node/definition/node-definition';

export interface NodeProvider {
  getAvailableNodes(): Promise<NodeDefinition[]>;
}
