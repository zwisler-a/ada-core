import { Input, INPUT_DATA_HOLDER } from '../../decorator/node-input.decorator';

describe('Node Output Decorator', () => {
  it('should do stuff', () => {
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
