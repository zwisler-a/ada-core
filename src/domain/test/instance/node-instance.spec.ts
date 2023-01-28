import { NodeDefinition } from '../../node/definition/node-definition';
import { NodeAttributeDefinition } from '../../node/definition/node-attribute-definition';
import { NodeInputDefinition } from '../../node/definition/node-input-definition';
import { NodeOutputDefinition } from '../../node/definition/node-output-definition';
import { NodeInstance } from '../../node/instance/node-instance';
import { DataHolder } from '../../node/data-holder';

class TestNodeInstance extends NodeInstance {
  handleInput(input: string, data: DataHolder) {}
}

class TestNodeDef extends NodeDefinition {
  attributes = [NodeAttributeDefinition.from('1', '1', '1')];
  inputs = [NodeInputDefinition.from('1', '1', '1')];
  outputs = [NodeOutputDefinition.from('1', '1', '1')];

  async createInstance() {
    return null;
  }
}

describe('Node Instance', () => {
  it('should emit an output', () => {
    const def = new TestNodeDef();
    const instance = new TestNodeInstance(def);
    const spy = jest.fn();
    instance.outputs[0].subscribe(spy);
    const dataObj = { data: true };
    instance.updateOutput(def.outputs[0].identifier, dataObj);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(dataObj);
  });

  it('should emit update an attribute', () => {
    const def = new TestNodeDef();
    const instance = new TestNodeInstance(def);
    const spy = jest.fn();
    const data = { data: true };
    expect(instance.updateAttribute('1', data)).toBe(true);
    expect(instance.getAttribute('1')).toBe(data);
  });
  it('should return false if nothing is found', () => {
    const def = new TestNodeDef();
    const instance = new TestNodeInstance(def);

    expect(instance.updateAttribute('2', {})).toBe(false);
    expect(instance.updateOutput('2', {})).toBe(false);
  });
});
