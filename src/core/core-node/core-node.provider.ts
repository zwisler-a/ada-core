import { NodeProvider } from '../interface/provider/node-provider.interface';
import { MapperNode } from './mapper-node';
import { NodeDefinition } from '../../domain/node/definition/node-definition';
import { LoggerNode } from './logger-node';
import { IntervalNode } from './interval-node';

export class CoreNodeProvider implements NodeProvider {
  async getAvailableNodes(): Promise<NodeDefinition[]> {
    return [new MapperNode(), new LoggerNode(), new IntervalNode()];
  }
}
