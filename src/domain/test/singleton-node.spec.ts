import { NodeAttributeDefinition } from '../node/definition/node-attribute-definition';
import { NodeInputDefinition } from '../node/definition/node-input-definition';
import { NodeOutputDefinition } from '../node/definition/node-output-definition';
import { DataHolder } from '../node/data-holder';
import { NodeSingletonDefinition } from '../node/definition/node-singleton-definition';
import { NodeState } from '../node/state/node-state';

export class TestNode extends NodeSingletonDefinition {
  public cb: any;

  handleInput(input: string, data: DataHolder) {
    if (this.cb) this.cb(data);
    return;
  }

  attributes = [NodeAttributeDefinition.from('1', 'Test', 'Test Desc')];

  inputs = [NodeInputDefinition.from('1', 'in', 'desc')];

  outputs = [NodeOutputDefinition.from('1', 'out', 'desc')];
}

describe('Networks', () => {
  const nodeDef = new TestNode();
  nodeDef.name = 'Test';
  it('should be able to instantiate a node', async () => {
    const instance = await nodeDef.createInstance(new NodeState());
    expect(instance.definition.name).toBe('Test');
  });

  it('should have all instances', async () => {
    const instance = await nodeDef.createInstance(new NodeState());
    expect(instance.outputs.length).toBe(1);
    expect(instance.inputs.length).toBe(1);
    expect(instance.attributes.length).toBe(1);
  });

  it('should call handle function', async () => {
    const spy = jest.fn();
    nodeDef.cb = spy;
    const instance = await nodeDef.createInstance(new NodeState());
    instance.handleInput(nodeDef.inputs[0].identifier, {});
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({});
  });
});
