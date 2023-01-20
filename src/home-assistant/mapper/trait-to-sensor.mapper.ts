import { GoogleDeviceTrait } from '../data-types/google-device.enums';
import { NodeOutputDefinition } from '../../domain/node/definition/node-output-definition';

export function mapTraitToNodeOutputDefinition(
  traits: GoogleDeviceTrait[] | string[],
): NodeOutputDefinition[] {
  const sensors: NodeOutputDefinition[] = [];

  // traits.forEach((trait) => {});

  return sensors;
}

export function mapTraitToNodeInputDefinition(
  traits: GoogleDeviceTrait[] | string[],
): NodeOutputDefinition[] {
  const nodeOutputDefinitions: NodeOutputDefinition[] = [];

  traits.forEach((trait) => {
    if (trait === GoogleDeviceTrait.OnOff) {
      nodeOutputDefinitions.push(
        NodeOutputDefinition.from(
          'action.devices.commands.OnOff',
          'On/Off',
          'Description',
        ),
      );
    }
    if (trait === GoogleDeviceTrait.TemperatureSetting) {
      nodeOutputDefinitions.push(
        NodeOutputDefinition.from(
          'action.devices.commands.ThermostatTemperatureSetpoint',
          'Set Temperature',
          'Set Temperature',
        ),
      );
    }
  });

  return nodeOutputDefinitions;
}
