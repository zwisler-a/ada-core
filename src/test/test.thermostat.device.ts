import { ActionDefinition } from "src/domain/devices/action-definition";
import { Device } from "src/domain/devices/device";
import { PrimitiveValueType } from "src/domain/value-types";

export class TestThermostat extends Device {

    public executionSpyable: Function;

    actorDefinition = [{
        name: 'Set Temperatur',
        description: 'Sets the target temperature of the device',
        parameters: {
            temperature: PrimitiveValueType.NUMBER
        }
    }]


    sensorDefinition = [{
        name: 'Current Temperature',
        description: 'Current Temperature the device is recording',
        type: { temperature: PrimitiveValueType.NUMBER }
    }]


    constructor(
        private id: number,
        public readonly name: string,
        public readonly description: string,
    ) { super() }


    execute(action: ActionDefinition, data) {
        if (action.name === this.actorDefinition[0].name) {
            this.executionSpyable(data);
        }
    }

    updateSensorData(data: any) {
        this.updateSensor.next({ definition: this.sensorDefinition[0], data });
    }

}