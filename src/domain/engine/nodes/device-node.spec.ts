import { Device } from "../../devices/device";
import { DeviceNode } from "./device-node";

describe('device node', () => {
    describe('creates a device node', () => {
        const device = new Device();
        device.synced = true;
        const sensor = [{
            name: 'testData',
            description: 'test',
            type: {}
        }]
        const actor = [{
            name: 'testAction',
            description: 'test',
            parameters: {}
        }]

        beforeEach(() => {
            device.actorDefinition = null;
            device.sensorDefinition = null;
        })

        it('should create input for actor', async () => {
            device.actorDefinition = actor;
            const inputs = new DeviceNode(device).getInputs()
            expect(Object.keys(inputs).length).toBe(1);
            expect(inputs['testAction'].name).toBe('testAction');
        });

        it('should create output for sensor', async () => {
            device.sensorDefinition = sensor;
            const output = new DeviceNode(device).getOutputs()
            expect(Object.keys(output).length).toBe(1);
            expect(output['testData'].name).toBe('testData');
        });

        it('should trigger a NodeOutput update on sensor update', async () => {
            const spy = jest.fn();
            device.sensorDefinition = sensor;
            const output = new DeviceNode(device).getOutputs()
            output['testData'].subscribe(spy);
            device.updateSensor.next({ definition: sensor[0], data: { 'hi': 'there' } });
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith({ 'hi': 'there' });
        });
    });
});