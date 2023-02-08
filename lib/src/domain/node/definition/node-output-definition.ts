import { Identifiable } from '../identifiable';
import { NodeOutputInstance } from '../instance/node-output-instance';
import { NodeInstance } from '../instance/node-instance';

export class NodeOutputDefinition extends Identifiable {
  createInstance(node: NodeInstance): NodeOutputInstance {
    const instance = new NodeOutputInstance();
    instance.definition = this;
    instance.node = node;
    return instance;
  }

  static from(identifier: string, name: string, description: string) {
    return new NodeOutputDefinition(identifier, name, description);
  }
}
