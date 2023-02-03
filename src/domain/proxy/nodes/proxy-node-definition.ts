import { NodeInstance } from '../../node/instance/node-instance';
import { NodeInputProxyDefinition } from '../decorator/node-input.decorator';
import { NodeOutputProxyDefinition } from '../decorator/node-output.decorator';
import { NodeAttributeProxyDefinition } from '../decorator/node-attribute.decorator';
import { NodeDefinition } from '../../node/definition/node-definition';
import { DataHolder } from '../../node/data-holder';
import { NodeAttributeDefinition } from '../../node/definition/node-attribute-definition';
import { NodeInputDefinition } from '../../node/definition/node-input-definition';
import { NodeOutputDefinition } from '../../node/definition/node-output-definition';
import { Identifiable } from '../../node/identifiable';
import {
  proxyAttributeChange,
  proxyIdentifiable,
} from '../property-definition-helper';
import { NodeDeconstructProxyDefinition } from '../decorator/node-deconstruct.decorator';
import { NodeState } from '../../node/state/node-state';

class ProxyNodeInstance extends NodeInstance {
  constructor(
    private proxyInputs: NodeInputProxyDefinition[],
    private proxyOutputs: NodeOutputProxyDefinition[],
    private proxyAttribute: NodeAttributeProxyDefinition[],
    private proxyDeconstruct: NodeDeconstructProxyDefinition,
    private nodeDefinition: NodeDefinition,
    private state: NodeState,
    private instance,
  ) {
    super(nodeDefinition, state);
    this.identifier = nodeDefinition.identifier;
    this.name = nodeDefinition.name;
    this.description = nodeDefinition.description;
    this.initializeOutputs();
    this.initializeAttributes();
    proxyIdentifiable(this, this.instance);
  }

  private initializeOutputs() {
    this.proxyOutputs?.forEach((output) => {
      this.instance[output.propertyKey] = (data: DataHolder) => {
        this.updateOutput(output.definition.identifier, data);
      };
    });
  }

  handleInput(identifier: string, data: DataHolder) {
    const input = this.proxyInputs.find(
      (input) => input.definition.identifier === identifier,
    );
    if (input) {
      this.instance[input.propertyKey](data);
    } else {
      throw new Error('Unknown input received!');
    }
  }

  onAttributeChange(identifier: string, value: DataHolder) {
    const input = this.proxyAttribute.find(
      (input) => input.definition.identifier === identifier,
    );
    if (input) {
      this.instance[input.propertyKey] = value;
    }
  }

  private initializeAttributes() {
    proxyAttributeChange(
      this.instance,
      this.proxyAttribute,
      (identifier, value) => this.updateAttribute(identifier, value),
    );
  }

  deconstruct() {
    if (this.proxyDeconstruct?.propertyKey)
      this.instance[this.proxyDeconstruct.propertyKey]();
  }
}

export class ProxyNodeDefinition extends NodeDefinition {
  attributes: NodeAttributeDefinition[] =
    this.proxyAttribute?.map((a) => a.definition) ?? [];
  inputs: NodeInputDefinition[] =
    this.proxyInputs?.map((input) => input.definition) ?? [];
  outputs: NodeOutputDefinition[] =
    this.proxyOutputs?.map((output) => output.definition) ?? [];

  constructor(
    private proxyInputs: NodeInputProxyDefinition[] = [],
    private proxyOutputs: NodeOutputProxyDefinition[] = [],
    private proxyAttribute: NodeAttributeProxyDefinition[] = [],
    private proxyDeconstruct: NodeDeconstructProxyDefinition,
    private nodeDefinition: Identifiable,
    private instantiateFunction: (def: NodeDefinition) => any,
  ) {
    super();
    this.identifier = nodeDefinition.identifier;
    this.name = nodeDefinition.name;
    this.description = nodeDefinition.description;
  }

  createInstance(state: NodeState): Promise<NodeInstance> {
    return Promise.resolve(
      new ProxyNodeInstance(
        this.proxyInputs,
        this.proxyOutputs,
        this.proxyAttribute,
        this.proxyDeconstruct,
        this,
        state,
        this.instantiateFunction(this),
      ),
    );
  }
}
