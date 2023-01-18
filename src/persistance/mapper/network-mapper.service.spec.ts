import { Test, TestingModule } from "@nestjs/testing";
import { Connection } from "../../domain/engine/connection";
import { AvailableDeviceService } from "../../core/service/available-device.service";
import { ActionDefinition } from "../../domain/devices/action-definition";
import { Device } from "../../domain/devices/device";
import { Network } from "../../domain/engine/network";
import { DeviceNode } from "../../domain/engine/nodes/device-node";
import { PrimitiveValueType } from "../../domain/value-types";
import { ConnectionMapper } from "./connection-mapper.service";
import { NetworkMapper } from "./network-mapper.service";
import { NodeMapper } from "./node-mapper.service";
import { MapperNode } from "../../core/core-nodes/mapper-node";

class TestThermostat extends Device {
    synced: boolean = true;
    name = 'Super cool testing device';
    description = 'This is a testing device!';

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

describe("Persistence Network Mapper", () => {

    let testSubject: NetworkMapper;

    let testDevice;

    const mockedAvailableDevices = {
        mapNodeEntityToNode: jest.fn(),
        findByIdentifier: (id: string) => testDevice
    }
    let network;


    beforeEach(() => {
        testDevice = new TestThermostat();
        testDevice.identifier = 'TEST'
        const nodes = [new DeviceNode(testDevice), new MapperNode(a => a)]
        const connections = [
            new Connection('id', nodes[0].getDefaultOutput(), nodes[1].getDefaultInput(), nodes[0], nodes[1]),
            new Connection('id2', nodes[1].getDefaultOutput(), nodes[0].getDefaultInput(), nodes[1], nodes[0])
        ]
        network = new Network('1', 'test', 'test', nodes, connections);
    })



    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NodeMapper,
                ConnectionMapper,
                NetworkMapper,
                {
                    provide: AvailableDeviceService,
                    useValue: mockedAvailableDevices,
                }
            ],
        }).compile();
        testSubject = await module.get(NetworkMapper);
    });


    it("should save a network", () => {
        const networkEntity = testSubject.mapNetworkToNetworkEntitiy(network);
        const mappedNetwork = testSubject.mapNetworkEntityToNetwork(networkEntity);
        expect(JSON.stringify(mappedNetwork)).toBe(JSON.stringify(network));
    })

    it("should be functional before mapping", () => {
        const spy = jest.fn();
        testDevice.executionSpyable = spy;

        testDevice.updateSensorData('test')
        expect(spy).toHaveBeenCalledWith('test')
    })

    it("should still be functional after mapping", () => {
        const networkEntity = testSubject.mapNetworkToNetworkEntitiy(network);
        const mappedNetwork = testSubject.mapNetworkEntityToNetwork(networkEntity);

        const spy = jest.fn();
        testDevice.executionSpyable = spy;

        testDevice.updateSensorData('test1')
        expect(spy).toHaveBeenCalledWith('test1')

        mappedNetwork.nodes[0].getDefaultOutput().emit('test2');
        expect(spy).toHaveBeenCalledWith('test2')
    });


    it("should function with unavailable device", () => {
        mockedAvailableDevices.findByIdentifier = () => null;

        const networkEntity = testSubject.mapNetworkToNetworkEntitiy(network);
        const mappedNetwork = testSubject.mapNetworkEntityToNetwork(networkEntity);

        const hasUnsyncedDevice =
            mappedNetwork.nodes.filter(n => n instanceof DeviceNode).some((node: DeviceNode) => !node.getDevice().synced)

        expect(hasUnsyncedDevice).toBe(true)
    });

})