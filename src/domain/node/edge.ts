import { NodeOutputInstance } from './instance/node-output-instance';
import { NodeInputInstance } from './instance/node-input-instance';
import { Identifiable } from './identifiable';

export class Edge extends Identifiable {
  subscription: { unsubscribe: () => void };

  constructor(
    public readonly output: NodeOutputInstance,
    public readonly input: NodeInputInstance,
  ) {
    super();
  }

  close() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
