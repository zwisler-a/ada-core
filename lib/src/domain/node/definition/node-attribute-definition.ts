import { Identifiable } from '../identifiable';
import { NodeAttributeInstance } from '../instance/node-attribute-instance';
import { AttributeState } from '../state/attribute-state';

export class NodeAttributeDefinition extends Identifiable {
  createInstance(state: AttributeState): NodeAttributeInstance {
    return new NodeAttributeInstance(this, state);
  }

  static from(identifier: string, name: string, description: string) {
    return new NodeAttributeDefinition(identifier, name, description);
  }
}
