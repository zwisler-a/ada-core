import {
  Output,
  OUTPUT_DATA_HOLDER,
} from '../../decorator/node-output.decorator';

describe('Node Input Decorator', () => {
  it('should do stuff', () => {
    const options = {
      identifier: '1',
      name: '2',
      description: '3',
    };

    abstract class TestDefinition {
      @Output(options)
      handle() {}
    }

    expect(TestDefinition.prototype[OUTPUT_DATA_HOLDER][0].propertyKey).toBe(
      'handle',
    );
  });
});
