import { ServerRemoteNodeInstance } from './server-remote-node-instance';
import { RemoteApiService } from '../service/remote-api.service';
import {
  NodeAttributeDefinition,
  NodeDefinition,
  NodeInputDefinition,
  NodeOutputDefinition,
  NodeState,
  RemoteNodeDefinition,
} from '@zwisler/ada-lib';

export class ServerRemoteNodeDefinition extends NodeDefinition {
  attributes = this.remoteNode.attributes.map((def) =>
    NodeAttributeDefinition.from(def.identifier, def.name, def.description),
  );
  inputs = this.remoteNode.inputs.map((def) =>
    NodeInputDefinition.from(def.identifier, def.name, def.description),
  );
  outputs = this.remoteNode.outputs.map((def) =>
    NodeOutputDefinition.from(def.identifier, def.name, def.description),
  );
  private instances: { [key: string]: ServerRemoteNodeInstance } = {};

  constructor(
    private remoteNode: RemoteNodeDefinition,
    private connectorIdentifier: string,
    private api: RemoteApiService,
  ) {
    super();
    this.identifier = remoteNode.identifier;
    this.name = remoteNode.name;
    this.description = remoteNode.description;
  }

  async createInstance(state: NodeState) {
    const identifier = await this.api.createInstance(
      this.connectorIdentifier,
      this.identifier,
      state,
    );
    const instance = new ServerRemoteNodeInstance(
      this,
      state,
      identifier,
      this.connectorIdentifier,
      this.api,
    );
    this.instances[identifier] = instance;
    return instance;
  }

  removeInstance(identifier: string) {
    delete this.instances[identifier];
  }

  connectorTimeout() {
    Object.keys(this.instances).forEach((instance) => {
      this.instances[instance].connectorTimeout();
    });
  }
}
