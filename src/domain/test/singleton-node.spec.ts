import { NodeAttributeDefinition } from '../node/definition/node-attribute-definition';
import { NodeInputDefinition } from '../node/definition/node-input-definition';
import { NodeOutputDefinition } from '../node/definition/node-output-definition';
import { DataHolder } from '../node/data-holder';
import { NodeSingletonDefinition } from '../node/definition/node-singleton-definition';

export class TestNode extends NodeSingletonDefinition {
  public cb: any;

  handleInput(input: NodeInputDefinition, data: DataHolder) {
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
  it('should be able to instantiate a node', () => {
    const instance = nodeDef.createInstance();
    expect(instance.definition.name).toBe('Test');
  });

  it('should have all instances', () => {
    const instance = nodeDef.createInstance();
    expect(instance.outputs.length).toBe(1);
    expect(instance.inputs.length).toBe(1);
    expect(instance.attributes.length).toBe(1);
  });

  it('should call handle function', () => {
    const spy = jest.fn();
    nodeDef.cb = spy;
    const instance = nodeDef.createInstance();
    instance.handleInput(nodeDef.inputs[0], {});
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({});
  });
});
