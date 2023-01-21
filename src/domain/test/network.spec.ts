import { Network } from '../node/network';
import { NodeAttributeDefinition } from '../node/definition/node-attribute-definition';
import { NodeInputDefinition } from '../node/definition/node-input-definition';
import { NodeOutputDefinition } from '../node/definition/node-output-definition';
import { NodeSingletonDefinition } from '../node/definition/node-singleton-definition';
import { DataHolder } from '../node/data-holder';
import { Edge } from '../node/edge';

class TestNodeDef extends NodeSingletonDefinition {
  spy: any;
  attributes = [NodeAttributeDefinition.from('1', '1', '1')];
  inputs = [NodeInputDefinition.from('1', '1', '1')];
  outputs = [NodeOutputDefinition.from('1', '1', '1')];

  handleInput(input: NodeInputDefinition, data: DataHolder) {
    this.spy(data);
  }
}

describe('Network', () => {
  it('should create a connection for each edge on start', () => {
    const edge = {
      output: {
        subscribe: jest.fn(),
      },
    } as any;
    const network = new Network([], [edge]);
    network.start();
    expect(edge.output.subscribe).toHaveBeenCalledTimes(1);
  });
  it('should close the connection for each edge on stop', () => {
    const unsubscribe = jest.fn();
    const edge = {
      output: {
        subscribe: () => ({ unsubscribe }),
      },
    } as any;
    const network = new Network([], [edge]);
    network.start();
    network.stop();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
  it('should have a string reporesenation', () => {
    const networkString = new Network([], []).toString();
    expect(networkString).toBeTruthy();
  });

  it('should pass data between connections', () => {
    const def = new TestNodeDef();
    const node1 = def.createInstance();
    const node2 = def.createInstance();
    const spy = jest.fn();
    def.spy = spy;
    const edge = new Edge(node1.outputs[0], node2.inputs[0]);
    const data = { data: true };
    const network = new Network([node1, node2], [edge]);
    node1.outputs[0].next(data);
    expect(spy).toHaveBeenCalledTimes(0);
    network.start();
    node1.outputs[0].next(data);
    expect(spy).toHaveBeenCalledTimes(1);
    network.stop();
    node1.outputs[0].next(data);
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should have a string reporesenation', () => {
    const networkString = new Network([], []).toString();
    expect(networkString).toBeTruthy();
  });
});
