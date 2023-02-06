import { Attribute, DataHolder, Input, Node, Output } from '@zwisler/ada-lib';

@Node({
  identifier: 'combine-latest',
  name: 'Combine latest',
  description: 'Combines the latest two values',
})
export class CombineLatestNode {
  @Attribute({
    identifier: 'combine-function',
    name: 'Combine function',
    description: '',
  })
  combineFunction: string;

  data1: any;

  data2: any;

  @Output({
    identifier: 'out',
    name: 'Combined Data',
    description: 'Sends the result of the combine function',
  })
  output: (data: DataHolder) => void;

  @Input({
    identifier: 'in1',
    name: 'CombineWith',
    description: 'Data',
  })
  handleInput1(data: DataHolder) {
    this.data1 = data;
    const func = new Function(
      'd1',
      'd2',
      `return (${this.combineFunction})(d1,d2)`,
    );
    this.output(func(this.data1, this.data2));
  }

  @Input({
    identifier: 'in2',
    name: 'Input2',
    description: 'Data',
  })
  handleInput2(data: DataHolder) {
    this.data2 = data;
  }
}
