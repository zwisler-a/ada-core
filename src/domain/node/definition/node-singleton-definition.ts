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

  handleInput(input: NodeInputDefinition, data: DataHolder) {
    this.singletonDefinition.handleInput(input, data);
  }
}

export abstract class NodeSingletonDefinition extends NodeDefinition {
  protected instances: NodeInstance[] = [];

  createInstance() {
    const instance = new NodeCallbackInstance(this);
    this.instances.push(instance);
    return instance;
  }

  abstract handleInput(input: NodeInputDefinition, data: DataHolder);

  updateOutput(output: NodeOutputDefinition, data: DataHolder) {
    this.instances.forEach((instance) => instance.updateOutput(output, data));
  }

  updateAttribute(identifier: string, data: DataHolder) {
    this.instances.forEach((instance) =>
      instance.updateAttribute(identifier, data),
    );
  }
}
