import { NodeAttributeDefinition } from '../node/definition/node-attribute-definition';
import { NodeInputDefinition } from '../node/definition/node-input-definition';
import { NodeOutputDefinition } from '../node/definition/node-output-definition';
import { DataHolder } from '../node/data-holder';
import { NodeInstance } from '../node/instance/node-instance';
import { NodeDefinition } from '../node/definition/node-definition';

export class TestNodeInstance extends NodeInstance {
  public static instanceCount = 0;
  private instanceNo = TestNodeInstance.instanceCount++;

  constructor(def: NodeDefinition, private cb) {
    super(def);
  }

  handleInput(input: NodeInputDefinition, data: DataHolder) {
    this.cb(this.instanceNo);
  }
}

export class TestNode extends NodeDefinition {
  public cb: any;

  createInstance(): NodeInstance {
    return new TestNodeInstance(this, this.cb);
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
    TestNodeInstance.instanceCount = 0;
    const spy = jest.fn();
    nodeDef.cb = spy;
    const instance = nodeDef.createInstance();
    instance.handleInput(nodeDef.inputs[0], {});
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(0);

    const instance2 = nodeDef.createInstance();
    instance2.handleInput(nodeDef.inputs[0], {});
    expect(spy).toHaveBeenCalledWith(1);
  });
});
