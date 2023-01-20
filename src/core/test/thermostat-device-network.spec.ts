import { Edge } from '../../domain/node/edge';
import { MapperNode } from '../core-node/mapper-node';
import { NodeSingletonDefinition } from '../../domain/node/definition/node-singleton-definition';
import { NodeOutputDefinition } from '../../domain/node/definition/node-output-definition';
import { NodeInputDefinition } from '../../domain/node/definition/node-input-definition';
import { DataHolder } from '../../domain/node/data-holder';
import { NodeAttributeDefinition } from '../../domain/node/definition/node-attribute-definition';
import { NodeInstance } from '../../domain/node/instance/node-instance';
import { Network } from '../../domain/node/network';

class TestThermostat extends NodeSingletonDefinition {
  public executionSpyable: any;

  outputs = [NodeOutputDefinition.from('ID', 'Set Temperature', 'description')];
  inputs = [
    NodeInputDefinition.from('ID', 'Current Temperature', 'description'),
  ];

  attributes: NodeAttributeDefinition[];

  updateSensorData(data: any) {
    this.updateOutput(this.outputs[0], data);
  }

  handleInput(input: NodeInputDefinition, data: DataHolder) {
    if (input.identifier === 'ID') {
      this.executionSpyable(data);
    }
  }
}

describe('network', () => {
  describe('create a mapper network', () => {
    const device = new TestThermostat();
    const deviceNodeInstance = device.createInstance();

    const mapperNode = new MapperNode((obj: any) => ({
      targetTemperature: obj.currentTemperature * 2,
    })).createInstance();

    const createConnection = (
      inputNode: NodeInstance,
      outNode: NodeInstance,
    ) => {
      return new Edge(inputNode.outputs[0], outNode.inputs[0]);
    };

    const connections = [
      createConnection(deviceNodeInstance, mapperNode),
      createConnection(mapperNode, deviceNodeInstance),
    ];

    new Network([], connections).start();
    it('should set the target temperature twice as high', async () => {
      const spy = jest.fn();
      device.executionSpyable = spy;
      device.updateSensorData({ currentTemperature: 12 });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ targetTemperature: 24 });
    });
  });
});
