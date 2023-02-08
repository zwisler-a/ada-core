import { Edge } from './edge';
import { Identifiable } from './identifiable';
import { NodeInstance } from './instance/node-instance';
import { Subscription } from '../observable';
import { NetworkState } from './state/network-state';

export class Network extends Identifiable {
  isActive = false;
  private subscriptions: Subscription<any>[] = [];

  constructor(
    public nodes: NodeInstance[],
    public edges: Edge[],
    public state: NetworkState = new NetworkState(),
  ) {
    super('', '', '');
  }

  start() {
    if (this.isActive) return;
    this.isActive = true;
    this.edges.forEach((edge) => {
      const subscription = edge.output.subscribe((data) =>
        edge.input.receive(data),
      );
      this.subscriptions.push(subscription);
    });
    this.nodes.forEach((node) => node.initialize());
  }

  stop() {
    this.nodes.forEach((node) => node.deconstruct());
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
    this.isActive = false;
  }
}
