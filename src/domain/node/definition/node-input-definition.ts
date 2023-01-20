import { Identifiable } from '../identifiable';
import { NodeInputInstance } from '../instance/node-input-instance';
import { NodeInstance } from '../instance/node-instance';

export class NodeInputDefinition extends Identifiable {
  createInstance(node: NodeInstance): NodeInputInstance {
    const instance = new NodeInputInstance();
    instance.definition = this;
    instance.identifier = this.identifier;
    instance.name = this.name;
    instance.description = this.description;
    instance.node = node;
    return instance;
  }

  static from(identifier: string, name: string, description: string) {
    const input = new NodeInputDefinition();
    input.identifier = identifier;
    input.name = name;
    input.description = description;
    return input;
  }
}
