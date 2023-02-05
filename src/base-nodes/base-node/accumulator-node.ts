import { Attribute, DataHolder, Input, Node, Output } from '@ada/lib';

@Node({
  identifier: 'accumulator',
  name: 'Accumulator',
  description: 'Accumulates data',
})
export class AccumulatorNode {
  @Attribute({
    identifier: 'accumulator-function',
    name: 'Accumulator function',
    description: '',
  })
  accumulatorFunction: string;

  @Attribute({
    identifier: 'data',
    name: 'Data',
    description: '',
  })
  data: string;

  @Output({
    identifier: 'out',
    name: 'Accumulated Data',
    description: 'Sends the accumulated data',
  })
  output: (data: DataHolder) => void;

  @Input({
    identifier: 'in',
    name: 'Input',
    description: 'Data to accumulate',
  })
  handleInput(data: DataHolder) {
    const func = new Function(
      'acc',
      'data',
      `return (${this.accumulatorFunction})(acc,data)`,
    );
    this.data = func(JSON.parse(this.data), data);
    this.output(this.data);
  }
}
