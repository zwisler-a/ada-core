import { SensorDataDefinition } from "src/domain/devices/sensor-data-definition";
import { PrimitiveValueType } from "src/domain/value-types";
import { GoogleDeviceTrait } from "../data-types/device";

export function mapTraitToSensorData(traits: GoogleDeviceTrait[] | string[]): { [command: string]: SensorDataDefinition } {
    const sensors: { [command: string]: SensorDataDefinition } = {}

    traits.forEach(trait => {

        if (trait === GoogleDeviceTrait.OnOff) {
            sensors['action.devices.commands.OnOff'] = {
                name: 'On/Off',
                description: 'Turn device on or off',
                type: { on: PrimitiveValueType.BOOLEAN }
            }
        }
        if (trait === GoogleDeviceTrait.TemperatureSetting) {
            sensors['action.devices.commands.ThermostatTemperatureSetpoint'] = {
                name: 'Set Temperature',
                description: 'Sets the target temperature of the device',
                type: { thermostatTemperatureSetpoint: PrimitiveValueType.NUMBER }
            }
        }

    })

    return sensors;
}