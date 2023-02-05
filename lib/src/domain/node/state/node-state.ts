import { AttributeState } from './attribute-state';
import { NetworkState } from './network-state';
import { Subject } from '../../observable';

export interface NodeStateSnapshot {
  [attributeId: string]: any;
}

export class NodeState extends Subject<NodeStateSnapshot> {
  constructor(private networkState: NetworkState) {
    super();
  }

  private state: { [attributeIdentifier: string]: AttributeState } = {};

  get(attributeIdentifier: string): AttributeState {
    if (!this.state[attributeIdentifier]) {
      this.state[attributeIdentifier] = new AttributeState(this);
    }
    return this.state[attributeIdentifier];
  }

  snapshot(): NodeStateSnapshot {
    const snapshot = {};
    Object.keys(this.state).forEach(
      (key) => (snapshot[key] = this.state[key].get()),
    );
    return snapshot;
  }

  update() {
    this.next(this.snapshot());
    if (this.networkState) this.networkState.update();
  }

  static from(snapshot: NodeStateSnapshot) {
    const state = new NodeState(null);
    Object.keys(snapshot).forEach((key) => {
      const attr = state.get(key);
      attr.set(snapshot[key]);
    });
    return state;
  }
}
