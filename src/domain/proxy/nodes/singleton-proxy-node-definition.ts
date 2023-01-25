import { NodeSingletonDefinition } from '../../node/definition/node-singleton-definition';
import { NodeAttributeDefinition } from '../../node/definition/node-attribute-definition';
import { NodeInputDefinition } from '../../node/definition/node-input-definition';
import { NodeOutputDefinition } from '../../node/definition/node-output-definition';
import { NodeInputProxyDefinition } from '../decorator/node-input.decorator';
import { NodeOutputProxyDefinition } from '../decorator/node-output.decorator';
import { NodeAttributeProxyDefinition } from '../decorator/node-attribute.decorator';
import { Identifiable } from '../../node/identifiable';
import { DataHolder } from '../../node/data-holder';
import { proxyAttributeChange } from '../property-definition-helper';

export class SingletonProxyNodeDefinition extends NodeSingletonDefinition {
  attributes: NodeAttributeDefinition[] = this.proxyAttribute.map(
    (a) => a.definition,
  );
  inputs: NodeInputDefinition[] = this.proxyInputs.map(
    (input) => input.definition,
  );
  outputs: NodeOutputDefinition[] = this.proxyOutputs.map(
    (output) => output.definition,
  );

  constructor(
    private proxyInputs: NodeInputProxyDefinition[],
    private proxyOutputs: NodeOutputProxyDefinition[],
    private proxyAttribute: NodeAttributeProxyDefinition[],
    private nodeDefinition: Identifiable,
    private instance: any,
  ) {
    super();
    this.identifier = nodeDefinition.identifier;
    this.name = nodeDefinition.name;
    this.description = nodeDefinition.description;
    this.initializeOutputs();
    this.initializeAttributes();
  }

  private initializeOutputs() {
    this.proxyOutputs.forEach((output) => {
      this.instance[output.propertyKey] = (data: DataHolder) => {
        this.updateOutput(output.definition.identifier, data);
      };
    });
  }

  private initializeAttributes() {
    proxyAttributeChange(
      this.instance,
      this.proxyAttribute,
      (identifier, value) => this.updateAttribute(identifier, value),
    );
  }

  onAttributeChange(identifier: string, value: DataHolder) {
    const input = this.proxyAttribute.find(
      (input) => input.definition.identifier,
    );
    if (input) {
      this.instance[input.propertyKey] = value;
    }
  }

  handleInput(identifier: string, data: DataHolder) {
    const input = this.proxyInputs.find((input) => input.definition.identifier);
    if (input) {
      this.instance[input.propertyKey](data);
    }
  }
}
