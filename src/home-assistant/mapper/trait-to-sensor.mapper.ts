import { ActionDefinition } from "src/domain/devices/action-definition";
import { SensorDataDefinition } from "src/domain/devices/sensor-data-definition";
import { PrimitiveValueType } from "src/domain/value-types";
import { GoogleDeviceTrait } from "../data-types/google-device.enums";

export function mapTraitToSensorData(traits: GoogleDeviceTrait[] | string[]): { [command: string]: SensorDataDefinition } {
    const sensors: { [command: string]: SensorDataDefinition } = {}

    traits.forEach(trait => {

     

    })

    return sensors;
}


export function mapTraitToActorData(traits: GoogleDeviceTrait[] | string[]): { [command: string]: ActionDefinition } {
    const action: { [command: string]: ActionDefinition } = {}

    traits.forEach(trait => {

        if (trait === GoogleDeviceTrait.OnOff) {
            action['action.devices.commands.OnOff'] = {
                name: 'On/Off',
                description: 'Turn device on or off',
                parameters: { on: PrimitiveValueType.BOOLEAN }
            }
        }
        if (trait === GoogleDeviceTrait.TemperatureSetting) {
            action['action.devices.commands.ThermostatTemperatureSetpoint'] = {
                name: 'Set Temperature',
                description: 'Sets the target temperature of the device',
                parameters: { thermostatTemperatureSetpoint: PrimitiveValueType.NUMBER }
            }
        }

    })

    return action;
}