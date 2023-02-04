import {
  NodeAttributeDefinition,
  NodeDefinition,
  NodeInputDefinition,
  NodeOutputDefinition,
  NodeState,
} from '../../domain';
import { RemoteNodeInstance } from './remote-node-instance';
import { RemoteApiService } from '../service/remote-api.service';
import { RemoteNodeDefinition } from '@ada/remote-lib';

export class RemoteNode extends NodeDefinition {
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
      {},
    );
    return new RemoteNodeInstance(
      this,
      state,
      identifier,
      this.connectorIdentifier,
      this.api,
    );
  }
}
