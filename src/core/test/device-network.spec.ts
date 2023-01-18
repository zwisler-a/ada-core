import { Connection } from "../../domain/engine/connection";
import { ActionDefinition } from "../../domain/devices/action-definition";
import { Device } from "../../domain/devices/device";
import { Node } from "../../domain/engine/node";
import { DeviceNode } from "../../domain/engine/nodes/device-node";
import { MapperNode } from "../core-nodes/mapper-node";


class TestActorDevice extends Device {
    synced: boolean = true;
    public spy: Function;

    execute(definition: ActionDefinition, data: any): void {
        if (definition.name === 'Action') {
            this.spy(data);
        }
    }
}

describe('network', () => {
    describe('create a network with devices and mapper', () => {
        const activatorDevice = new Device()
        activatorDevice.sensorDefinition = [{ name: 'Activation', description: 'test', type: {} }]


        const actorDevice = new TestActorDevice();
        actorDevice.actorDefinition = [{ name: 'Action', description: 'test', parameters: {} }]

        const activatorNode = new DeviceNode(activatorDevice);
        const actorNode = new DeviceNode(actorDevice);
        const mapperNode = new MapperNode((data) => ({ brightness: data['device.brightness'] }))


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
            createConnection(activatorNode, mapperNode),
            createConnection(mapperNode, actorNode)
        ]


        it('pass data through the mapper network', async () => {
            const spy = jest.fn();
            actorDevice.spy = spy;
            activatorNode.getDefaultOutput().emit({ 'device.brightness': 100 })
            expect(spy).toBeCalledWith({ brightness: 100 });
            expect(spy).toHaveBeenCalledTimes(1);
        });
    });
});