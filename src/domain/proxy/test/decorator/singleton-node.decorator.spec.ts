import {
  SINGLETON_NODE_DATA_HOLDER,
  SingletonNode,
} from '../../decorator/singleton-node.decorator';

describe('Node Singleton Decorator', () => {
  it('should hold data', () => {
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
