import { NodeProvider } from '../execution/interface/node-provider.interface';
import { MapperNode } from './base-node/mapper-node';
import { LoggerNode } from './base-node/logger-node';
import { DelayNode } from './base-node/delay-node';
import { Logger } from '@nestjs/common';
import { ConditionalNode } from './base-node/conditional-node';
import { AccumulatorNode } from './base-node/accumulator-node';
import { NodeDefinition, ProxyHelper } from '@zwisler/ada-lib';
import { FetchNode } from './base-node/fetch-node';
import { HttpService } from '@nestjs/axios';
import { CronNode } from './base-node/cron-node';
import { LoopNode } from './base-node/loop-node';

export class BaseNodeProvider implements NodeProvider {
  private logger = new Logger('Logger Node');

  constructor(private http: HttpService) {}

  async getAvailableNodes(): Promise<NodeDefinition[]> {
    return [
      ProxyHelper.create(MapperNode),
      ProxyHelper.create(LoggerNode, this.logger),
      ProxyHelper.create(DelayNode),
      ProxyHelper.create(ConditionalNode),
      ProxyHelper.create(AccumulatorNode),
      ProxyHelper.create(FetchNode, this.http),
      ProxyHelper.create(CronNode),
      ProxyHelper.create(LoopNode),
    ];
  }
}
