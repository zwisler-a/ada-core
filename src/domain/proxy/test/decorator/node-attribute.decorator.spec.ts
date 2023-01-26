import {
  Attribute,
  ATTRIBUTE_DATA_HOLDER,
} from '../../decorator/node-attribute.decorator';

describe('Node Attribute Decorator', () => {
  it('should do stuff', () => {
    const options = {
      identifier: '1',
      name: '2',
      description: '3',
    };

    abstract class TestDefinition {
      @Attribute(options)
      attr;
    }

    expect(TestDefinition.prototype[ATTRIBUTE_DATA_HOLDER][0].propertyKey).toBe(
      'attr',
    );
  });
});
