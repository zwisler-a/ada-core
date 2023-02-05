import { INPUT_DATA_HOLDER } from '../../decorator/node-input.decorator';
import {
  Deconstruct,
  DECONSTRUCT_DATA_HOLDER,
} from '../../decorator/node-deconstruct.decorator';

describe('Node Deconstruct Decorator', () => {
  it('should do stuff', () => {
    abstract class TestDefinition {
      @Deconstruct()
      handle() {}
    }

    expect(TestDefinition.prototype[DECONSTRUCT_DATA_HOLDER]).toEqual({
      propertyKey: 'handle',
    });
  });
  it('should not be definined multiple times', () => {
    expect(() => {
      abstract class TestDefinition {
        @Deconstruct()
        handle() {}

        @Deconstruct()
        handle2() {}
      }
    }).toThrow();
  });
});
