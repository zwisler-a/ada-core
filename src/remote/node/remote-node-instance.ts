import { NodeInstance } from '../../domain/node/instance/node-instance';
import { NodeInputDefinition } from '../../domain/node/definition/node-input-definition';
import { DataHolder } from '../../domain/node/data-holder';
import { RemoteApiService } from '../service/remote-api.service';
import { NodeDefinition } from '../../domain/node/definition/node-definition';

export class RemoteNodeInstance extends NodeInstance {
  constructor(
    definition: NodeDefinition,
    private remoteIdentifier: string,
    private connectorUrl: string,
    private api: RemoteApiService,
  ) {
    super(definition);
  }

  handleInput(input: string, data: DataHolder) {
    this.api
      .updateInput(
        this.connectorUrl,
        this.remoteIdentifier,
        input,
        JSON.stringify(data),
      )
      .then((res) => {
        res.forEach((update) => {
          const output = this.outputs.find(
            (o) => o.definition.identifier === update.identifier,
          );
          if (output)
            this.updateOutput(
              output.definition.identifier,
              JSON.parse(update.value),
            );
        });
      });
  }

  onAttributeChange(identifier: string, value: DataHolder) {
    this.api.updateInput(
      this.connectorUrl,
      this.remoteIdentifier,
      identifier,
      JSON.stringify(value),
    );
  }
}
