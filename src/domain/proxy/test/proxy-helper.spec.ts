import { SingletonNode } from '../decorator/singleton-node.decorator';
import { ProxyHelper } from '../proxy-helper';
import { Attribute } from '../decorator/node-attribute.decorator';
import { Input } from '../decorator/node-input.decorator';
import { Output } from '../decorator/node-output.decorator';
import { SingletonProxyNodeDefinition } from '../nodes/singleton-proxy-node-definition';
import { Node } from '../decorator/node.decorator';
import { Deconstruct } from '../decorator/node-deconstruct.decorator';
import { NodeState } from '../../node/state/node-state';

describe('ProxyHelper', () => {
  it('should create a node', function () {
    @SingletonNode({
      name: '',
      description: '',
      identifier: 'identifier',
    })
    class TestSingletonNode {}

    const node = ProxyHelper.create(TestSingletonNode);
    expect(node.identifier).toBe('identifier');
  });
  it('should have everything on singleton', async function () {
    const id = {
      name: '',
      description: '',
      identifier: 'identifier',
    };

    const inputSpy = jest.fn();

    @SingletonNode(id)
    class TestSingletonNode {
      @Attribute(id)
      attr: string;

      @Input(id)
      input(data) {
        inputSpy(data);
      }

      @Output(id)
      out: () => void;
    }

    const node = ProxyHelper.create(
      TestSingletonNode,
    ) as SingletonProxyNodeDefinition;
    expect(node.identifier).toBe('identifier');
    expect(node.outputs.length).toBe(1);
    expect(node.inputs.length).toBe(1);
    expect(node.attributes.length).toBe(1);

    const instance = await node.createInstance(new NodeState());

    instance.handleInput('1', 'data');
    expect(inputSpy).toBeCalledWith('data');
    const outputSpy = jest.fn();
    instance.outputs[0].subscribe(outputSpy);
    node.getInstance().out('data2');
    expect(outputSpy).toBeCalledWith('data2');

    node.getInstance().attr = '123';
    expect(instance.getAttribute('identifier')).toBe('123');

    node.onAttributeChange('identifier', 'data3');
    expect(instance.getAttribute('identifier')).toBe('data3');
  });

  it('should deconstruct an instance', async function () {
    const spy = jest.fn();

    @Node({
      name: '',
      description: '',
      identifier: 'identifier',
    })
    class TestNode {
      @Deconstruct()
      deconstruct() {
        spy();
      }
    }

    const node = ProxyHelper.create(TestNode);
    const instance = await node.createInstance();
    instance.deconstruct();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
