import {
  Identifiable,
  NodeAttributeDefinition,
  NodeDefinition,
  NodeInputDefinition,
  NodeOutputDefinition,
  NodeState,
} from '@zwisler/ada-lib';
import { ServerNodeHolderInstance } from './server-node-holder-instance';

export class ServerNodeHolderDefinition extends NodeDefinition {
  attributes: NodeAttributeDefinition[] = this.nodeDefinition.attributes;
  inputs: NodeInputDefinition[] = this.nodeDefinition.inputs;
  outputs: NodeOutputDefinition[] = this.nodeDefinition.outputs;

  private instances: { [key: string]: ServerNodeHolderInstance } = {};

  constructor(private nodeDefinition: NodeDefinition) {
    super(nodeDefinition);
  }

  async createInstance(
    state: NodeState,
    identifier: Identifiable,
  ): Promise<ServerNodeHolderInstance> {
    const instance = new ServerNodeHolderInstance(
      await this.nodeDefinition.createInstance(state, identifier),
      this,
      state,
    );
    this.instances[instance.identifier] = instance;
    return instance;
  }

  disconnect() {
    Object.keys(this.instances).forEach((instanceKey) => {
      this.instances[instanceKey].disconnect();
    });
  }

  reconnect() {
    return Promise.all(
      Object.keys(this.instances).map(async (instanceKey) => {
        const oldInstance = this.instances[instanceKey];
        const instance = await this.nodeDefinition.createInstance(
          NodeState.from(oldInstance.getNodeStateSnapshot()),
          oldInstance,
        );
        delete this.instances[instanceKey];
        oldInstance.setNodeInstance(instance);
        this.instances[oldInstance.identifier] = oldInstance;
      }),
    );
  }

  isInUse() {
    return Object.keys(this.instances).length > 0;
  }

  deconstruct(identifier: string) {
    delete this.instances[identifier];
  }

  disconnected() {
    return Object.keys(this.instances).some((instanceKey) =>
      this.instances[instanceKey].disconnected(),
    );
  }
}
