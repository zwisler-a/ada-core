import {
  mapTraitToNodeInputDefinition,
  mapTraitToNodeOutputDefinition,
} from '../mapper/trait-to-sensor.mapper';
import { GoogleDeviceDto } from './google-device.dto';
import { NodeSingletonDefinition } from '../../domain/node/definition/node-singleton-definition';
import { NodeAttributeDefinition } from '../../domain/node/definition/node-attribute-definition';
import { NodeOutputDefinition } from '../../domain/node/definition/node-output-definition';
import { NodeInputDefinition } from '../../domain/node/definition/node-input-definition';
import { DataHolder } from '../../domain/node/data-holder';

export class GoogleHomeDevice extends NodeSingletonDefinition {
  identifier = this.googleDevice.id;
  name = this.googleDevice.name.name;
  description = this.googleDevice.name.name;

  attributes: NodeAttributeDefinition[];
  inputs: NodeInputDefinition[] = mapTraitToNodeInputDefinition(
    this.googleDevice.traits,
  );
  outputs: NodeOutputDefinition[] = mapTraitToNodeOutputDefinition(
    this.googleDevice.traits,
  );

  constructor(private googleDevice: GoogleDeviceDto) {
    super();
  }

  executeCommand(command: string, data: any) {
    const output = this.outputs.find((o) => (o.identifier = command));
    if (output) this.updateOutput(output, data);
  }

  handleInput(input: NodeInputDefinition, data: DataHolder) {}
}
