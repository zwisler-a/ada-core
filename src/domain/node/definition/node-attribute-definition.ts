import { Identifiable } from '../identifiable';
import { NodeAttributeInstance } from '../instance/node-attribute-instance';

export class NodeAttributeDefinition extends Identifiable {
  createInstance(): NodeAttributeInstance {
    const instance = new NodeAttributeInstance();
    instance.definition = this;
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
