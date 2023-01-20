import { Edge } from '../../domain/node/edge';
import { MapperNode } from '../core-node/mapper-node';
import { NodeInstance } from '../../domain/node/instance/node-instance';
import { Network } from '../../domain/node/network';

describe('network', () => {
  describe('create a mapper network', () => {
    const mul2Mapper = new MapperNode((s) => ({ n: s.n * 2 })).createInstance();
    const div2Mapper = new MapperNode((s) => ({ n: s.n / 2 })).createInstance();
    const plus2Mapper = new MapperNode((s) => ({
      n: s.n + 2,
    })).createInstance();

    const createConnection = (
      inputNode: NodeInstance,
      outNode: NodeInstance,
    ) => {
      return new Edge(inputNode.outputs[0], outNode.inputs[0]);
    };

    const connections = [
      createConnection(mul2Mapper, div2Mapper),
      createConnection(div2Mapper, plus2Mapper),
    ];
    new Network([], connections).start();

    it('pass data through the mapper network', async () => {
      const spy = jest.fn();
      plus2Mapper.outputs[0].subscribe(spy);
      mul2Mapper.inputs[0].node.handleInput(mul2Mapper.inputs[0].definition, {
        n: 1,
      });
      expect(spy).toHaveBeenCalledWith({ n: 3 });
    });
  });
});
