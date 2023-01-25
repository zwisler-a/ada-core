import { NodeDefinition } from '../definition/node-definition';
import { DataHolder } from '../data-holder';
import { NodeInputInstance } from './node-input-instance';
import { NodeAttributeInstance } from './node-attribute-instance';
import { NodeOutputInstance } from './node-output-instance';
import { Identifiable } from '../identifiable';

export abstract class NodeInstance extends Identifiable {
  definition: NodeDefinition;

  attributes: NodeAttributeInstance[];
  outputs: NodeOutputInstance[];
  inputs: NodeInputInstance[];

  constructor(definition: NodeDefinition) {
    super();
    this.definition = definition;
    this.inputs = definition.inputs?.map((input) => input.createInstance(this));
    this.outputs = definition.outputs?.map((o) => o.createInstance(this));
    this.attributes = definition.attributes?.map((a) => a.createInstance(this));
  }

  abstract handleInput(identifier: string, data: DataHolder);

  updateOutput(identifier: string, data: DataHolder) {
    const instance = this.outputs.find(
      (instance) => instance.definition.identifier === identifier,
    );
    if (instance) {
      instance.next(data);
      return true;
    }
    return false;
  }

  updateAttribute(identifier: string, data: DataHolder) {
    const instance = this.attributes.find(
      (instance) => instance.definition.identifier === identifier,
    );
    if (instance) {
      instance.value = data;
      return true;
    } else {
      return false;
    }
  }

  getAttribute(identifier: string) {
    const instance = this.attributes.find(
      (instance) => instance.definition.identifier === identifier,
    );
    if (instance) return instance.value;
  }

  onAttributeChange(identifier: string, value: DataHolder) {
    // Noop
  }

  deconstruct() {
    // Noop
  }

  initialize() {
    // Noop
  }
}
