import { NodeDefinition } from '../definition/node-definition';
import { NodeOutputDefinition } from '../definition/node-output-definition';
import { DataHolder } from '../data-holder';
import { NodeInputDefinition } from '../definition/node-input-definition';
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

  abstract handleInput(input: NodeInputDefinition, data: DataHolder);

  updateOutput(output: NodeOutputDefinition, data: DataHolder) {
    const instance = this.outputs.find(
      (instance) => instance.definition.identifier === output.identifier,
    );
    if (instance) instance.next(data);
  }

  updateAttribute(identifier: string, data: DataHolder) {
    const instance = this.attributes.find(
      (instance) => instance.identifier === identifier,
    );
    if (instance) instance.value = data;
  }

  getAttribute(identifier: string) {
    const instance = this.attributes.find(
      (instance) => instance.definition.identifier === identifier,
    );
    if (instance) return instance.value;
  }
}
