import { NodeProvider } from '../execution/interface/node-provider.interface';
import { MapperNode } from './base-node/mapper-node';
import { NodeDefinition } from '../domain/node/definition/node-definition';
import { LoggerNode } from './base-node/logger-node';
import { IntervalNode } from './base-node/interval-node';
import { DelayNode } from './base-node/delay-node';
import { ProxyHelper } from '../domain/proxy/proxy-helper';
import { Logger } from '@nestjs/common';

export class BaseNodeProvider implements NodeProvider {
  private logger = new Logger('Logger Node');

  async getAvailableNodes(): Promise<NodeDefinition[]> {
    return [
      ProxyHelper.create(MapperNode),
      ProxyHelper.create(LoggerNode, this.logger),
      ProxyHelper.create(IntervalNode),
      ProxyHelper.create(DelayNode),
    ];
  }
}
