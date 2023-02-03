import { NodeProvider } from '../execution/interface/node-provider.interface';
import { MapperNode } from './base-node/mapper-node';
import { NodeDefinition, ProxyHelper } from '../domain';
import { LoggerNode } from './base-node/logger-node';
import { IntervalNode } from './base-node/interval-node';
import { DelayNode } from './base-node/delay-node';
import { Logger } from '@nestjs/common';
import { ConditionalNode } from './base-node/conditional-node';
import { AccumulatorNode } from './base-node/accumulator-node';

export class BaseNodeProvider implements NodeProvider {
  private logger = new Logger('Logger Node');

  async getAvailableNodes(): Promise<NodeDefinition[]> {
    return [
      ProxyHelper.create(MapperNode),
      ProxyHelper.create(LoggerNode, this.logger),
      ProxyHelper.create(IntervalNode),
      ProxyHelper.create(DelayNode),
      ProxyHelper.create(ConditionalNode),
      ProxyHelper.create(AccumulatorNode),
    ];
  }
}
