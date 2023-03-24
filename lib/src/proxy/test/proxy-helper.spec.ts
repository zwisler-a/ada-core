import { ProxyHelper } from '../proxy-helper';
import { Node } from '../decorator/node.decorator';
import { Deconstruct } from '../decorator/node-deconstruct.decorator';
import { NodeState } from '../../domain/node/state/node-state';
import { Identifiable } from '../../domain/node/identifiable';

describe('ProxyHelper', () => {
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
    const instance = await node.createInstance(
      new NodeState(null),
      Identifiable.create(''),
    );
    instance.deconstruct();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
