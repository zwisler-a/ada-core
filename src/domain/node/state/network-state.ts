import { NodeState } from './node-state';

export class NetworkState {
  private state: {
    [nodeIdentifier: string]: NodeState;
  } = {};

  get(nodeIdentifier: string): NodeState {
    if (!this.state[nodeIdentifier]) {
      this.state[nodeIdentifier] = new NodeState();
    }
    return this.state[nodeIdentifier];
  }
}
