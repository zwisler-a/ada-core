import { NodeProvider } from '../core/interface/node-provider.interface';
import { MapperNode } from './base-node/mapper-node';
import { NodeDefinition } from '../domain/node/definition/node-definition';
import { LoggerNode } from './base-node/logger-node';
import { IntervalNode } from './base-node/interval-node';

export class BaseNodeProvider implements NodeProvider {
  async getAvailableNodes(): Promise<NodeDefinition[]> {
    return [new MapperNode(), new LoggerNode(), new IntervalNode()];
  }
}
