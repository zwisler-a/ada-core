import { Identifiable } from '../identifiable';
import { NodeInputInstance } from '../instance/node-input-instance';
import { NodeInstance } from '../instance/node-instance';

export class NodeInputDefinition extends Identifiable {
  createInstance(node: NodeInstance): NodeInputInstance {
    const instance = new NodeInputInstance();
    instance.definition = this;
    instance.node = node;
    return instance;
  }

  static from(identifier: string, name: string, description: string) {
    return new NodeInputDefinition(identifier, name, description);
  }
}
