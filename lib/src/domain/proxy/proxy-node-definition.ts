import { NodeInstance } from '../node/instance/node-instance';
import { NodeInputProxyDefinition } from './decorator/node-input.decorator';
import { NodeOutputProxyDefinition } from './decorator/node-output.decorator';
import { NodeAttributeProxyDefinition } from './decorator/node-attribute.decorator';
import { NodeDefinition } from '../node/definition/node-definition';
import { DataHolder } from '../node/data-holder';
import { NodeAttributeDefinition } from '../node/definition/node-attribute-definition';
import { NodeInputDefinition } from '../node/definition/node-input-definition';
import { NodeOutputDefinition } from '../node/definition/node-output-definition';
import { Identifiable } from '../node/identifiable';
import { proxyAttributeChange } from './property-definition-helper';
import { NodeDeconstructProxyDefinition } from './decorator/node-deconstruct.decorator';
import { NodeState } from '../node/state/node-state';
import { NodeInitializeProxyDefinition } from './decorator/node-initialize.decorator';

class ProxyNodeInstance extends NodeInstance {
  constructor(
    identifiable: Identifiable,
    private proxyInputs: NodeInputProxyDefinition[],
    private proxyOutputs: NodeOutputProxyDefinition[],
    private proxyAttribute: NodeAttributeProxyDefinition[],
    private proxyDeconstruct: NodeDeconstructProxyDefinition,
    private proxyInitialize: NodeInitializeProxyDefinition,
    private nodeDefinition: NodeDefinition,
    protected state: NodeState,
    private classInstance,
  ) {
    super(identifiable, nodeDefinition, state);
    this.initializeOutputs();
    this.initializeAttributes();
  }

  private initializeOutputs() {
    this.proxyOutputs?.forEach((output) => {
      this.classInstance[output.propertyKey] = (data: DataHolder) => {
        this.updateOutput(output.definition.identifier, data);
      };
    });
  }

  handleInput(identifier: string, data: DataHolder) {
    const input = this.proxyInputs.find(
      (input) => input.definition.identifier === identifier,
    );
    if (input) {
      this.classInstance[input.propertyKey](data);
    } else {
      throw new Error('Unknown input received!');
    }
  }

  getNodeStateSnapshot() {
    return this.state.snapshot();
  }

  onAttributeChange(identifier: string, value: DataHolder) {
    const input = this.proxyAttribute.find(
      (input) => input.definition.identifier === identifier,
    );
    if (input) {
      this.classInstance[input.propertyKey] = value;
    }
  }

  private initializeAttributes() {
    proxyAttributeChange(
      this.classInstance,
      this.proxyAttribute,
      this.state,
      (identifier, value) => this.updateAttribute(identifier, value),
    );
  }

  deconstruct() {
    if (this.proxyDeconstruct?.propertyKey)
      this.classInstance[this.proxyDeconstruct.propertyKey]();
  }

  initialize() {
    if (this.proxyInitialize?.propertyKey)
      this.classInstance[this.proxyInitialize.propertyKey]();
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
    private proxyInitialize: NodeInitializeProxyDefinition,
    private nodeDefinition: Identifiable,
    private instantiateFunction: (def: NodeDefinition) => any,
  ) {
    super(
      nodeDefinition.identifier,
      nodeDefinition.name,
      nodeDefinition.description,
    );
  }

  createInstance(
    state: NodeState,
    identifiable: Identifiable,
  ): Promise<NodeInstance> {
    return Promise.resolve(
      new ProxyNodeInstance(
        identifiable,
        this.proxyInputs,
        this.proxyOutputs,
        this.proxyAttribute,
        this.proxyDeconstruct,
        this.proxyInitialize,
        this,
        state,
        this.instantiateFunction(this),
      ),
    );
  }
}
