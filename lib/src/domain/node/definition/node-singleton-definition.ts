import { NodeInstance } from '../instance/node-instance';
import { DataHolder } from '../data-holder';
import { NodeDefinition } from './node-definition';
import { NodeState } from '../state/node-state';

class NodeCallbackInstance extends NodeInstance {
  constructor(
    private singletonDefinition: NodeSingletonDefinition,
    nodeState: NodeState,
  ) {
    super(singletonDefinition, nodeState);
  }

  handleInput(input: string, data: DataHolder) {
    this.singletonDefinition.handleInput(input, data);
  }

  onAttributeChange(identifier: string, value: DataHolder) {
    this.singletonDefinition.onAttributeChange(identifier, value);
  }
}

export abstract class NodeSingletonDefinition extends NodeDefinition {
  protected instances: NodeInstance[] = [];

  async createInstance(state: NodeState) {
    const instance = new NodeCallbackInstance(this, state);
    this.instances.push(instance);
    return instance;
  }

  abstract handleInput(identifier: string, data: DataHolder);

  updateOutput(identifier: string, data: DataHolder) {
    this.instances.forEach((instance) =>
      instance.updateOutput(identifier, data),
    );
  }

  updateAttribute(identifier: string, data: DataHolder) {
    this.instances.forEach((instance) =>
      instance.updateAttribute(identifier, data),
    );
  }

  onAttributeChange(identifier: string, value: DataHolder) {}
}
