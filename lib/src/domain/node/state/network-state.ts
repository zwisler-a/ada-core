import { NodeState, NodeStateSnapshot } from './node-state';
import { Subject } from '../../observable';

export interface NetworkStateSnapshot {
  [nodeId: string]: NodeStateSnapshot;
}

export class NetworkState extends Subject<NetworkStateSnapshot> {
  private state: {
    [nodeIdentifier: string]: NodeState;
  } = {};

  get(nodeIdentifier: string): NodeState {
    if (!this.state[nodeIdentifier]) {
      this.state[nodeIdentifier] = new NodeState(this);
    }
    return this.state[nodeIdentifier];
  }

  snapshot(): NetworkStateSnapshot {
    const snapshot = {};
    Object.keys(this.state).forEach(
      (key) => (snapshot[key] = this.state[key].snapshot()),
    );
    return snapshot;
  }

  update() {
    this.next(this.snapshot());
  }
}
