import { Input } from './node-input.decorator';
import { DataHolder } from '../../node/data-holder';
import {
  SINGLETON_NODE_DATA_HOLDER,
  SingletonNode,
} from './singleton-node.decorator';

describe('Node Input Decorator', () => {
  it('shoudl hold data', () => {
    const options = {
      identifier: '1',
      name: '2',
      description: '3',
    };

    @SingletonNode(options)
    abstract class TestDefinition {}

    expect(TestDefinition.prototype[SINGLETON_NODE_DATA_HOLDER]).toEqual(
      options,
    );
  });
});
