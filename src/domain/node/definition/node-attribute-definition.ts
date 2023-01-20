import { Identifiable } from '../identifiable';
import { NodeAttributeInstance } from '../instance/node-attribute-instance';
import { NodeInstance } from '../instance/node-instance';

export class NodeAttributeDefinition extends Identifiable {
  createInstance(p: NodeInstance): NodeAttributeInstance {
    const instance = new NodeAttributeInstance();
    instance.definition = this;
    instance.name = this.name;
    instance.description = this.description;
    return instance;
  }

  static from(identifier: string, name: string, description: string) {
    const attr = new NodeAttributeDefinition();
    attr.identifier = identifier;
    attr.name = name;
    attr.description = description;
    return attr;
  }
}
