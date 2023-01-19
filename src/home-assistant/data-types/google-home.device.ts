import { ActionDefinition } from "src/domain/devices/action-definition";
import { SensorDataDefinition } from "src/domain/devices/sensor-data-definition";
import { Device } from "../../domain/devices/device";
import { mapTraitToActorData, mapTraitToSensorData } from "../mapper/trait-to-sensor.mapper";
import { GoogleDeviceDto } from "./google-device.dto";

export class GoogleHomeDevice extends Device {

    identifier = this.googleDevice.id;

    synced = true;
    name = this.googleDevice.name.name
    description = this.googleDevice.name.name;

    sensorCommandDefinitions = mapTraitToSensorData(this.googleDevice.traits);
    actorCommandDefinition = mapTraitToActorData(this.googleDevice.traits)

    sensorDefinition?: SensorDataDefinition[] = Object.values(this.sensorCommandDefinitions);
    actorDefinition?: ActionDefinition[] = Object.values(this.actorCommandDefinition);
    
    constructor(private googleDevice: GoogleDeviceDto) {
        super();
    }

    executeCommand(command: string, data: any) {
        const output = this.sensorCommandDefinitions[command];
        if (output) this.updateSensor.next({ definition: output, data });
    }

}