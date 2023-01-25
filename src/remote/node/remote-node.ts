import { NodeDefinition } from '../../domain/node/definition/node-definition';
import { NodeInstance } from '../../domain/node/instance/node-instance';
import { RemoteNodeDefinitionDto } from '../dto/remote-node-definition.dto';
import { RemoteNodeInstance } from './remote-node-instance';
import { HttpService } from '@nestjs/axios';
import { RemoteApiService } from '../service/remote-api.service';

export class RemoteNode extends NodeDefinition {
  attributes = this.remoteNode.attributes;
  inputs = this.remoteNode.inputs;
  outputs = this.remoteNode.outputs;

  constructor(
    private remoteNode: RemoteNodeDefinitionDto,
    private connectorUrl: string,
    private api: RemoteApiService,
  ) {
    super();
    this.identifier = remoteNode.identifier;
    this.name = remoteNode.name;
    this.description = remoteNode.description;
  }

  async createInstance() {
    const { identifier } = await this.api.createInstance(this.connectorUrl);
    return new RemoteNodeInstance(
      this,
      identifier,
      this.connectorUrl,
      this.api,
    );
  }
}
