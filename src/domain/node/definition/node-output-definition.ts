import { Identifiable } from '../identifiable';
import { NodeOutputInstance } from '../instance/node-output-instance';
import { NodeInstance } from '../instance/node-instance';

export class NodeOutputDefinition extends Identifiable {
  createInstance(node: NodeInstance): NodeOutputInstance {
    const instance = new NodeOutputInstance();
    instance.definition = this;
    instance.identifier = this.identifier;
    instance.name = this.name;
    instance.description = this.description;
    instance.node = node;
    return instance;
  }

  static from(identifier: string, name: string, description: string) {
    const output = new NodeOutputDefinition();
    output.identifier = identifier;
    output.name = name;
    output.description = description;
    return output;
  }
}
