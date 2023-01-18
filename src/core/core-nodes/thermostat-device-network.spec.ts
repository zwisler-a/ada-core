import { ActionDefinition } from "../../domain/devices/action-definition";
import { Device } from "../../domain/devices/device";
import { Connection } from "../../domain/engine/connection";
import { Node } from "../../domain/engine/node";
import { DeviceNode } from "../../domain/engine/nodes/device-node";
import { PrimitiveValueType } from "../../domain/value-types";
import { MapperNode } from "./mapper-node";


class TestThermostat extends Device {
    synced: boolean = true;
    public executionSpyable: Function;

    actorDefinition = [{
        name: 'Set Temperatur',
        description: 'Sets the target temperature of the device',
        parameters: {
            targetTemperature: PrimitiveValueType.NUMBER
        }
    }]


    sensorDefinition = [{
        name: 'Current Temperature',
        description: 'Current Temperature the device is recording',
        type: { currentTemperature: PrimitiveValueType.NUMBER }
    }]

    execute(action: ActionDefinition, data) {
        if (action.name === this.actorDefinition[0].name) {
            this.executionSpyable(data);
        }
    }

    updateSensorData(data: any) {
        this.updateSensor.next({ definition: this.sensorDefinition[0], data });
    }

}

describe('network', () => {
    describe('create a mapper network', () => {
        const device = new TestThermostat()
        const deviceNode = new DeviceNode(device);

        const mapperNode = new MapperNode(
            (obj: any) => ({ targetTemperature: obj.currentTemperature * 2 })
        )

        const createConnection = (inputNode: Node, outNode: Node) => {
            return new Connection(
                null,
                inputNode.getDefaultOutput(),
                outNode.getDefaultInput(),
                inputNode,
                outNode
            )
        }

        const connections = [
            createConnection(deviceNode, mapperNode),
            createConnection(mapperNode, deviceNode)
        ]


        it('should set the target temperature twice as high', async () => {
            const spy = jest.fn();
            device.executionSpyable = spy;
            device.updateSensorData({ currentTemperature: 12 })
            expect(spy).toHaveBeenCalledTimes(1)
            expect(spy).toHaveBeenCalledWith({ targetTemperature: 24 })
        });
    });

});