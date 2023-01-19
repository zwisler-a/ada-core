import { SensorDataDefinition } from "src/domain/devices/sensor-data-definition";
import { Device } from "../../domain/devices/device";
import { mapTraitToSensorData } from "../mapper/trait-to-sensor.mapper";
import { GoogleDeviceEntity } from "../persistance/device.entitiy";

export class GoogleHomeDevice extends Device {

    identifier = this.googleDevice.id;

    synced = true;
    name = this.googleDevice.name
    description = this.googleDevice.name;

    sensorCommandDefinitions = mapTraitToSensorData(this.googleDevice.traits.split(','));

    sensorDefinition?: SensorDataDefinition[] = Object.values(this.sensorCommandDefinitions);

    constructor(private googleDevice: GoogleDeviceEntity) {
        super();
    }

    executeCommand(command: string, data: any) {
        const output = this.sensorCommandDefinitions[command];
        if (output) this.updateSensor.next({ definition: output, data });
    }

}