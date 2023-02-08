import { ServerRemoteNodeInstance } from './server-remote-node-instance';
import { RemoteNodeApiService } from '../service/remote-node-api.service';
import {
  Identifiable,
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

  constructor(
    private remoteNode: RemoteNodeDefinition,
    private connectorIdentifier: string,
    private api: RemoteNodeApiService,
  ) {
    super(remoteNode.identifier, remoteNode.name, remoteNode.description);
  }

  async createInstance(state: NodeState, identifier: Identifiable) {
    return new ServerRemoteNodeInstance(
      identifier,
      this,
      state,
      this.connectorIdentifier,
      this.api,
    );
  }
}
