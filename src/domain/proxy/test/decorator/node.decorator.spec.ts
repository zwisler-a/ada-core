import { Node, NODE_DATA_HOLDER } from '../../decorator/node.decorator';

describe('Node Decorator', () => {
  it('should have data', () => {
    const options = {
      identifier: '1',
      name: '2',
      description: '3',
    };

    @Node(options)
    abstract class TestDefinition {
      attr;
    }

    expect(TestDefinition.prototype[NODE_DATA_HOLDER]).toEqual(options);
  });
});
