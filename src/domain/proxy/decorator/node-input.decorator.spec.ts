import { Input, INPUT_DATA_HOLDER } from './node-input.decorator';
import { DataHolder } from '../../node/data-holder';
import {
  SINGLETON_NODE_DATA_HOLDER,
  SingletonNode,
} from './singleton-node.decorator';

describe('Node Input Decorator', () => {
  it('shoudl do stuff', () => {
    const options = {
      identifier: '1',
      name: '2',
      description: '3',
    };

    abstract class TestDefinition {
      @Input(options)
      handle() {}
    }

    expect(TestDefinition.prototype[INPUT_DATA_HOLDER][0].propertyKey).toBe(
      'handle',
    );
  });
});
