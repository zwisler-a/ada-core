import { NodeInputDefinition } from './node-input-definition';
import { NodeOutputDefinition } from './node-output-definition';
import { NodeInstance } from '../instance/node-instance';
import { DataHolder } from '../data-holder';
import { NodeDefinition } from './node-definition';
import { NodeAttributeDefinition } from './node-attribute-definition';

class NodeCallbackInstance extends NodeInstance {
  constructor(private singletonDefinition: NodeSingletonDefinition) {
    super(singletonDefinition);
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

  async createInstance() {
    const instance = new NodeCallbackInstance(this);
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
