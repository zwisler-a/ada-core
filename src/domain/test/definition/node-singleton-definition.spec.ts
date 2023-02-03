import { NodeInputDefinition } from '../../node/definition/node-input-definition';
import { NodeAttributeDefinition } from '../../node/definition/node-attribute-definition';
import { NodeOutputDefinition } from '../../node/definition/node-output-definition';
import { NodeSingletonDefinition } from '../../node/definition/node-singleton-definition';
import { DataHolder } from '../../node/data-holder';
import { NodeState } from '../../node/state/node-state';

class TestNodeDef extends NodeSingletonDefinition {
  spy: any;
  attributes = [NodeAttributeDefinition.from('1', '1', '1')];
  inputs = [NodeInputDefinition.from('1', '1', '1')];
  outputs = [NodeOutputDefinition.from('1', '1', '1')];

  handleInput(input, data: DataHolder) {
    this.spy(data);
  }
}

describe('Node Singleton', () => {
  it('should update all instance outputs', async function () {
    const def = new TestNodeDef();
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    const instance1 = await def.createInstance(new NodeState());
    const instance2 = await def.createInstance(new NodeState());
    instance1.outputs[0].subscribe(spy1);
    instance2.outputs[0].subscribe(spy2);
    const data = { data: true };
    def.updateOutput(def.outputs[0].identifier, data);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy1).toHaveBeenCalledWith(data);
    expect(spy2).toHaveBeenCalledWith(data);
  });
  it('should update all instance outputs', async function () {
    const def = new TestNodeDef();
    const instance1 = await def.createInstance(new NodeState());
    const instance2 = await def.createInstance(new NodeState());
    const data = { data: true };
    def.updateAttribute('1', data);
    expect(instance1.getAttribute('1')).toBe(data);
    expect(instance2.getAttribute('1')).toBe(data);
  });
});
