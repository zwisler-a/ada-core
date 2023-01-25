import {
  NodeAttributeDefinition,
  NodeDefinition,
  NodeInputDefinition,
  NodeOutputDefinition,
} from '../../domain';
import { RemoteNodeInstance } from './remote-node-instance';
import { RemoteApiService } from '../service/remote-api.service';
import { RemoteNodeDefinition } from '../events/connector.event';

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

  async createInstance() {
    const identifier = await this.api.createInstance(
      this.connectorIdentifier,
      this.identifier,
    );
    return new RemoteNodeInstance(
      this,
      identifier,
      this.connectorIdentifier,
      this.api,
    );
  }
}
